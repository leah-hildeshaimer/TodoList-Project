using Microsoft.EntityFrameworkCore;
using TodoApi; 

var builder = WebApplication.CreateBuilder(args);

// --- הגדרות שירותים (Services) ---

// 1. הגדרת CORS - מאפשר ל-React (הפרונטנד) לדבר עם השרת
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 2. תמיכה ב-Swagger וב-Controllers (בשביל ה-Auth)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

// 3. חיבור למסד הנתונים ב-Clever Cloud
var connectionString = builder.Configuration.GetConnectionString("ToDoDB");

builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(connectionString, 
        new MySqlServerVersion(new Version(8, 0, 36)), 
        mysqlOptions => mysqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null)
    ));

var app = builder.Build();

// --- הגדרות הרצה (Middleware) ---

// יצירת הטבלאות באופן אוטומטי אם הן לא קיימות
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ToDoDbContext>();
    if (db.Database.CanConnect()) 
    {
        db.Database.EnsureCreated();
    }
}

app.UseCors("AllowAll");

// הפעלת Swagger (תמיד דולק כדי שתוכלי לבדוק בקלות)
app.UseSwagger();
app.UseSwaggerUI();

// --- הגדרת הכתובות (Routes) של המשימות ---

// 1. שליפת משימות של משתמש ספציפי (GET)
// עכשיו הכתובת היא /items/{userId}
app.MapGet("/items/{userId}", async (int userId, ToDoDbContext db) =>
    await db.Items.Where(i => i.UserId == userId).ToListAsync());

// 2. הוספת משימה חדשה (POST)
app.MapPost("/items", async (ToDoDbContext db, Item item) =>
{
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/items/{item.Id}", item);
});

// 3. עדכון משימה קיימת (PUT)
app.MapPut("/items/{id}", async (ToDoDbContext db, int id, Item inputItem) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();

    item.IsComplete = inputItem.IsComplete;
    if (!string.IsNullOrEmpty(inputItem.Name))
    {
        item.Name = inputItem.Name;
    }

    try 
    {
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error updating item: {ex.Message}");
        return Results.Problem("Database update failed");
    }
});

// 4. מחיקת משימה (DELETE)
app.MapDelete("/items/{id}", async (ToDoDbContext db, int id) =>
{
    if (await db.Items.FindAsync(id) is Item item)
    {
        db.Items.Remove(item);
        await db.SaveChangesAsync();
        return Results.Ok(item);
    }
    return Results.NotFound();
});

app.MapGet("/", () => "The ToDo API is Running! 🚀");

// חיבור ה-AuthController (חשוב מאוד להרשמה ולוגין!)
app.MapControllers();

app.Run();
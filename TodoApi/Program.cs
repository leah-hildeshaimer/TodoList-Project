
using Microsoft.EntityFrameworkCore;
using TodoApi; 

var builder = WebApplication.CreateBuilder(args);
// 1. כאן מוסיפים את ההגדרה (לפני ה-Build)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
// 1. הוספת תמיכה ב-Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// חיבור למסד הנתונים
// חיבור למסד הנתונים - הגדרה מפורשת כדי למנוע קריסה ב-Render
var connectionString = builder.Configuration.GetConnectionString("ToDoDB");

builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(connectionString, 
        new MySqlServerVersion(new Version(8, 0, 36)), // הגדרת גרסה ידנית במקום AutoDetect
        mysqlOptions => mysqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null)
    ));
// var connectionString = builder.Configuration.GetConnectionString("ToDoDB");
// builder.Services.AddDbContext<ToDoDbContext>(options =>
//     options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});
var app = builder.Build();

app.UseCors("AllowAll");
// 2. הפעלת ממשק ה-Swagger
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

// 3. הגדרת הכתובות (Routes)
// --- שלב 2: הגדרת הכתובות של ה-API (Routes) ---

// 1. שליפת כל המשימות (GET)
app.MapGet("/items", async (ToDoDbContext db) =>
    await db.Items.ToListAsync());

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
    // 1. נחפש את המשימה המקורית מהדאטה-בייס
    var item = await db.Items.FindAsync(id);
    
    // 2. אם היא לא קיימת - נחזיר 404
    if (item is null) return Results.NotFound();

    // 3. התיקון הקריטי: עדכון הסטטוס בלבד
    // בגלל שהריאקט שולח אובייקט חלקי, אנחנו ניגש ישירות לשדה IsComplete
    item.IsComplete = inputItem.IsComplete;

    // 4. עדכון השם רק אם נשלח שם חדש ולא ריק
    if (!string.IsNullOrEmpty(inputItem.Name))
    {
        item.Name = inputItem.Name;
    }

    // 5. שמירה
    try 
    {
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    catch (Exception ex)
    {
        // אם עדיין יש שגיאה, נדפיס אותה לטרמינל כדי שנדע מה קרה
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
app.MapGet("/", () => "Hello World!");

app.Run();
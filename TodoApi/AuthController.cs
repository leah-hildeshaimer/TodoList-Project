using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace TodoApi; // מוודא שזה באותו Namespace של שאר הקבצים שלך

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly ToDoDbContext _context;

    public AuthController(ToDoDbContext context)
    {
        _context = context;
    }

    // הרשמה: מקבל שם משתמש וסיסמה ושומר בטבלה החדשה שיצרנו ב-Workbench
    [HttpPost("register")]
    public async Task<IActionResult> Register(User user)
    {
        // בדיקה אם שם המשתמש כבר תפוס
        if (await _context.Users.AnyAsync(u => u.Username == user.Username))
            return BadRequest("Username already exists");

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Registration successful" });
    }

    // התחברות: בודק אם השם והסיסמה קיימים ומחזיר את ה-ID של המשתמש
    [HttpPost("login")]
    public async Task<IActionResult> Login(User loginData)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == loginData.Username && u.Password == loginData.Password);

        if (user == null)
            return Unauthorized("Invalid username or password");

        // מחזירים את ה-Id כדי שהפרונטנד ידע למי שייכות המשימות
        return Ok(new { userId = user.Id, username = user.Username });
    }
}
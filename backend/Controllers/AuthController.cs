using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using backend.Models;
using backend.Data;
using backend.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController:ControllerBase
{
private readonly AppDbContext _context;
private readonly IConfiguration _config;
private readonly PasswordHasher<User> _hasher = new PasswordHasher<User>();

public AuthController(AppDbContext context, IConfiguration config)
{
    _context = context;
    _config=config;
}
[HttpPost("login")]
public IActionResult Login(LoginRequest request)
    {
        User? user=null;
        foreach(User u in _context.Users)
        {
            if (u.userName == request.username)
            {
                user=u;
                break;
            }
        }
        if (user == null)
        {
            return Unauthorized();
        }
        var hasher=new PasswordHasher<User>();
        var result=hasher.VerifyHashedPassword(user, user.passwordHash,request.password);
        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized();
        }
        var claims = new List<Claim>
          {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.userName),
            new Claim(ClaimTypes.Role, user.role)
      };
      var key = new SymmetricSecurityKey(
    Convert.FromBase64String(_config["Jwt:Key"]!)
);
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: credentials);

        var tokenString = new JwtSecurityTokenHandler()
       .WriteToken(token);
        return Ok(new
{
    message = "Login successful",
    token = tokenString,
    role = user.role
});
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }
    [HttpPost("couriers")]
public IActionResult CreateCourier(CreatePostierRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Username) ||
        string.IsNullOrWhiteSpace(request.Password) ||
        request.Password.Length < 8)
    {
        return BadRequest("Username is required and password must be at least 8 characters.");
    }

    bool exists = _context.Users.Any(u => u.userName == request.Username);

    if (exists)
    {
        return Conflict("Username already exists.");
    }

    var courier = new User
    {
        userName = request.Username,
        role = "Courier"
    };

    var hasher = new PasswordHasher<User>();

    courier.passwordHash = hasher.HashPassword(
        courier,
        request.Password
    );

    _context.Users.Add(courier);
    _context.SaveChanges();

    return StatusCode(201, new
    {
        courier.Id,
        courier.userName,
        courier.role
    });
}


[HttpGet("couriers")]
public IActionResult GetCouriers()
{
    var couriers = _context.Users
        .Where(u => u.role == "Courier")
        .Select(u => new
        {
            u.Id,
            u.userName
        })
        .ToList();

    return Ok(couriers);
}
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Data;
using backend.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/courier/orders")]
[Authorize(Roles = "Courier")]
public class CourierOrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public CourierOrdersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("my")]
    public IActionResult GetMyOrders()
    {
        int courierId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var orders = _context.Orders
            .Where(o => o.CourierId == courierId)
            .ToList();

        return Ok(orders);
    }
[HttpPut("{id}/status")]
public IActionResult UpdateStatus(int id, UpdateStatusRequest request)
{
    int courierId = int.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!
    );

    var order = _context.Orders.Find(id);

    if (order == null)
        return NotFound();

    if (order.CourierId != courierId)
        return Forbid();

    if (order.Status == "Delivered")
    return BadRequest("Order already delivered");

    if (order.Status == "Pending" && request.Status != "InTransit")
    return BadRequest("Order must be in transit first");

    if (order.Status == "InTransit" && request.Status != "Delivered")
    return BadRequest("Order must be delivered next");

    order.Status = request.Status;
    _context.SaveChanges();

    return Ok("Status updated");
}
}
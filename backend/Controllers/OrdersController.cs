using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using Microsoft.AspNetCore.Authorization;
using backend.DTOs;
namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class OrdersController : ControllerBase
{
   

   private readonly AppDbContext _context;
   public OrdersController(AppDbContext context)
   {
    _context = context;
   }
    
    

 [HttpGet]
 public IActionResult GetOrders()
    { 
    var orders = _context.Orders.Select(o => new
    {
        o.Id,
        o.Customer,
        o.Address,
        o.Phone,
        o.Status,
        o.CourierId
    }).ToList();

    return Ok(orders);
}
    

[HttpPost]
public IActionResult CreateOrder(OrderRequest request)
{
    var order = new Order
    {
        Customer = request.Customer,
        Address = request.Address,
        Phone = request.Phone,
        Status = "Pending"
    };

    _context.Orders.Add(order);
    _context.SaveChanges();

    return StatusCode(201);
}

[HttpPut("{id}")]
public IActionResult PutOrder(int id, OrderRequest request)
{
    var order = _context.Orders.Find(id);

    if (order == null)
    {
        return NotFound();
    }

    order.Customer = request.Customer;
    order.Address = request.Address;
    order.Phone = request.Phone;

    _context.SaveChanges();

    return NoContent();
}
    
[HttpDelete("{id}")]
public IActionResult DeleteOrder(int id)
    {
        Order? gjejOrderin=_context.Orders.Find(id);
        
            if (gjejOrderin == null)
            {
                return NotFound();
            }
            _context.Orders.Remove(gjejOrderin);
            _context.SaveChanges();
            return NoContent();
    }
[HttpPut("{id}/assign")]
public IActionResult AssignCourier(int id, AssignCourierRequest request)
{
    var order = _context.Orders.Find(id);

    if (order == null)
    {
        return NotFound("Order not found");
    }

    var courier = _context.Users.Find(request.CourierId);

    if (courier == null || courier.role != "Courier")
    {
        return BadRequest("Invalid courier");
    }

    order.CourierId = courier.Id;

    _context.SaveChanges();

    return Ok("Courier assigned successfully");
}
    }

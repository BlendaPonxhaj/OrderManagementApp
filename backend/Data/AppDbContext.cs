using Microsoft.EntityFrameworkCore;
using backend.Models;
namespace backend.Data;

public class AppDbContext : DbContext
{
public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options)
{
}
public DbSet<Order> Orders { get; set; } = null!;
public DbSet<User> Users { get; set; } = null!;
}
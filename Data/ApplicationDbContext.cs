using Microsoft.EntityFrameworkCore;

namespace HCSqaprojectv1test.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // Add your DbSets here
    // Example:
    // public DbSet<User> Users { get; set; }
    // public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure your entities here
        // Example:
        // modelBuilder.Entity<User>().HasKey(u => u.Id);
        // modelBuilder.Entity<User>().Property(u => u.Name).IsRequired().HasMaxLength(100);
    }
}

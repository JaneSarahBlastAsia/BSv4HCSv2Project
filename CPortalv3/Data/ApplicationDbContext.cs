using Microsoft.EntityFrameworkCore;
using Models.Entities;

namespace CPortalv3.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<PaymentInfo> PaymentInfos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>()
                .HasOne(c => c.Address)
                .WithOne(a => a.Customer)
                .HasForeignKey<Address>(a => a.CustomerId);

            modelBuilder.Entity<Customer>()
                .HasOne(c => c.PaymentInfo)
                .WithOne(p => p.Customer)
                .HasForeignKey<PaymentInfo>(p => p.CustomerId);
        }
    }
}

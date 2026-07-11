using Microsoft.EntityFrameworkCore;
using System;


public class RetailContext : DbContext
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(
            "Server=localhost;Database=RetailDB;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True;",
            sqlOptions => sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,              // how many times to retry
                maxRetryDelay: TimeSpan.FromSeconds(10), // wait between retries
                errorNumbersToAdd: null        // retry on all transient errors
            )
        );
    }
}

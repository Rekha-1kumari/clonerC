using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

class Program
{
    static async Task Main(string[] args)
    {
        using var context = new RetailContext();

        await context.Database.EnsureCreatedAsync();

        // ✅ Always reseed for demo purposes
        context.Categories.RemoveRange(context.Categories);
        context.Products.RemoveRange(context.Products);
        await context.SaveChangesAsync();

        var electronics = new Category { Name = "Electronics" };
        var groceries = new Category { Name = "Groceries" };

        await context.Categories.AddRangeAsync(electronics, groceries);

        // Products
        var product1 = new Product { Name = "Laptop", Price = 75000, Category = electronics };
        var product2 = new Product { Name = "Rice Bag", Price = 1200, Category = groceries };
        var product3 = new Product { Name = "Phone", Price = 50000, Category = electronics };
        var product4 = new Product { Name = "Tablet", Price = 30000, Category = electronics };
        var product5 = new Product { Name = "Headphones", Price = 5000, Category = electronics };
        var product6 = new Product { Name = "Sugar Pack", Price = 200, Category = groceries };
        var product7 = new Product { Name = "Cooking Oil", Price = 1500, Category = groceries };

        await context.Products.AddRangeAsync(product1, product2, product3, product4, product5, product6, product7);
        await context.SaveChangesAsync();

        // Lab 5: Retrieve data
        Console.WriteLine("\n--- Lab 5: Retrieve Data ---");
        Console.WriteLine("Categories:");
        foreach (var category in context.Categories)
            Console.WriteLine($"- {category.Name}");

        Console.WriteLine("\nProducts:");
        foreach (var product in context.Products.Include(p => p.Category))
            Console.WriteLine($"- {product.Name} ({product.Category.Name}) - Rs.{product.Price}");

        // Lab 6: Update a product
        Console.WriteLine("\n--- Lab 6: Update/Delete ---");
        var laptop = await context.Products.FirstOrDefaultAsync(p => p.Name == "Laptop");
        if (laptop != null)
        {
            laptop.Price = 70000;
            await context.SaveChangesAsync();
            Console.WriteLine($"Updated: {laptop.Name} new price Rs.{laptop.Price}");
        }

        var riceBag = await context.Products.FirstOrDefaultAsync(p => p.Name == "Rice Bag");
        if (riceBag != null)
        {
            context.Products.Remove(riceBag);
            await context.SaveChangesAsync();
            Console.WriteLine($"Deleted: {riceBag.Name}");
        }

        // Lab 7: LINQ Queries
        Console.WriteLine("\n--- Lab 7: LINQ Queries ---");
        Console.WriteLine("Filtered & Sorted Products (Price > 1000, Descending):");
        var filtered = await context.Products
            .Where(p => p.Price > 1000)
            .OrderByDescending(p => p.Price)
            .ToListAsync();

        foreach (var p in filtered)
            Console.WriteLine($"{p.Name} - Rs.{p.Price}");

        Console.WriteLine("\nProjected DTOs (Name + Price):");
        var productDTOs = await context.Products
            .Select(p => new { p.Name, p.Price })
            .ToListAsync();

        foreach (var dto in productDTOs)
            Console.WriteLine($"{dto.Name} - Rs.{dto.Price}");

        // Final product list
        Console.WriteLine("\n--- Final Product List ---");
        foreach (var product in context.Products.Include(p => p.Category))
            Console.WriteLine($"- {product.Name} ({product.Category.Name}) - Rs.{product.Price}");
    }
}

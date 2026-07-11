using System;

class Program
{
    static void Main()
    {
        Product[] products =
        {
            new Product(101, "Laptop", "Electronics"),
            new Product(102, "Mobile", "Electronics"),
            new Product(103, "Shoes", "Fashion"),
            new Product(104, "Watch", "Accessories"),
            new Product(105, "Book", "Education")
        };

        int targetId = 104;

        Product linearResult = SearchOperations.LinearSearch(products, targetId);
        Console.WriteLine("Linear Search Result:");
        Console.WriteLine(linearResult != null
            ? $"{linearResult.ProductId} - {linearResult.ProductName}"
            : "Product not found");

        Product binaryResult = SearchOperations.BinarySearch(products, targetId);
        Console.WriteLine("\nBinary Search Result:");
        Console.WriteLine(binaryResult != null
            ? $"{binaryResult.ProductId} - {binaryResult.ProductName}"
            : "Product not found");
    }
}

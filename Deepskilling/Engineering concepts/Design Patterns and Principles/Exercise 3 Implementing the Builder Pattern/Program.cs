class Program
{
    static void Main(string[] args)
    {
        Computer computer1 = new Computer.Builder()
            .SetCPU("Intel i7")
            .SetRAM(16)
            .SetStorage(512)
            .SetGraphicsCard("NVIDIA RTX 3060")
            .SetOperatingSystem("Windows 11")
            .Build();

        Computer computer2 = new Computer.Builder()
            .SetCPU("AMD Ryzen 5")
            .SetRAM(8)
            .SetStorage(256)
            .SetOperatingSystem("Linux")
            .Build();

        computer1.Display();
        computer2.Display();

        Console.ReadLine();
    }
}
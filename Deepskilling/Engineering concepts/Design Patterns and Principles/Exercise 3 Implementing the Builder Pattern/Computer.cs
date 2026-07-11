public class Computer
{
    private string CPU;
    private int RAM;
    private int Storage;
    private string GraphicsCard;
    private string OperatingSystem;

    private Computer(Builder builder)
    {
        CPU = builder.CPU;
        RAM = builder.RAM;
        Storage = builder.Storage;
        GraphicsCard = builder.GraphicsCard;
        OperatingSystem = builder.OperatingSystem;
    }

    public class Builder
    {
        public string CPU;
        public int RAM;
        public int Storage;
        public string GraphicsCard;
        public string OperatingSystem;

        public Builder SetCPU(string CPU)
        {
            this.CPU = CPU;
            return this;
        }

        public Builder SetRAM(int RAM)
        {
            this.RAM = RAM;
            return this;
        }

        public Builder SetStorage(int Storage)
        {
            this.Storage = Storage;
            return this;
        }

        public Builder SetGraphicsCard(string GraphicsCard)
        {
            this.GraphicsCard = GraphicsCard;
            return this;
        }

        public Builder SetOperatingSystem(string OperatingSystem)
        {
            this.OperatingSystem = OperatingSystem;
            return this;
        }

        public Computer Build()
        {
            return new Computer(this);
        }
    }

    public void Display()
    {
        Console.WriteLine("Computer Configuration:");
        Console.WriteLine("CPU: " + CPU);
        Console.WriteLine("RAM: " + RAM + " GB");
        Console.WriteLine("Storage: " + Storage + " GB");
        Console.WriteLine("Graphics Card: " + GraphicsCard);
        Console.WriteLine("Operating System: " + OperatingSystem);
        Console.WriteLine();
    }
}

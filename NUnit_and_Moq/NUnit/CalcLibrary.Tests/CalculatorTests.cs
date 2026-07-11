using NUnit.Framework;
using CalcLibrary;

namespace CalcLibrary.Tests
{
    [TestFixture]
    public class CalculatorTests
    {
        private Calculator? calculator;

        [SetUp]
        public void Init()
        {
            calculator = new Calculator();
        }

        [TearDown]
        public void Cleanup()
        {
            calculator = null;
        }

        [Test]
        public void Add_TwoNumbers_ReturnsSum()
        {
            int result = calculator!.Add(10, 20);

            Assert.That(result, Is.EqualTo(30));
        }
    }
}
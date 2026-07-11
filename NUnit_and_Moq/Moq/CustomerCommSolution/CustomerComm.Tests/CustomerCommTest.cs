using NUnit.Framework;
using Moq;
using CustomerCommLib;

namespace CustomerCommLib.Tests
{
    [TestFixture]
    public class CustomerCommTest
    {
        private Mock<IMailSender> mockMailSender;

        [OneTimeSetUp]
        public void Init()
        {
            mockMailSender =
                new Mock<IMailSender>();
        }

        [TestCase]
        public void SendMailToCustomer_ShouldReturnTrue()
        {
            // Arrange

            mockMailSender
                .Setup(x => x.SendMail(
                    It.IsAny<string>(),
                    It.IsAny<string>()))
                .Returns(true);

            CustomerComm customerComm =
                new CustomerComm(mockMailSender.Object);

            // Act

            bool result =
                customerComm.SendMailToCustomer();

            // Assert

            Assert.That(result, Is.True);
        }
    }
}
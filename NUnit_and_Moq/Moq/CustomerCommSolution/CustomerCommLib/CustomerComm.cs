namespace CustomerCommLib
{
    public class CustomerComm
    {
        IMailSender _mailSender;

        public CustomerComm(IMailSender mailSender)
        {
            _mailSender = mailSender;
        }

        public bool SendMailToCustomer()
        {
            string email = "cust123@abc.com";
            string message = "Some Message";

            _mailSender.SendMail(email, message);

            return true;
        }
    }
}
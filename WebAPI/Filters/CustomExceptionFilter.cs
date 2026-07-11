using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class CustomExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        var exceptionMessage = context.Exception.Message;

        // log to file
        File.AppendAllText("exceptions.log", $"{DateTime.Now}: {exceptionMessage}{Environment.NewLine}");

        context.Result = new ObjectResult("Internal Server Error")
        {
            StatusCode = StatusCodes.Status500InternalServerError
        };
    }
}

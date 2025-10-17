using Microsoft.AspNetCore.Mvc;

namespace HCSqaprojectv1test.Controllers;

[Route("Error")]
public class ErrorController : Controller
{
    private readonly ILogger<ErrorController> _logger;

    public ErrorController(ILogger<ErrorController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Handle general error page
    /// </summary>
    /// <returns>General error page</returns>
    [HttpGet]
    public IActionResult Error()
    {
        _logger.LogWarning("General error page requested");
        
        if (Request.Headers.Accept.Any(accept => accept?.Contains("application/json") ?? false))
        {
            return HandleApiError(500);
        }

        return HandleRazorError(500);
    }
    
    /// <summary>
    /// Handle error pages for different status codes
    /// </summary>
    /// <param name="statusCode">HTTP status code</param>
    /// <returns>Error page or API response</returns>
    [HttpGet("{statusCode}")]
    public IActionResult ErrorWithStatusCode(int statusCode)
    {
        _logger.LogWarning("Error page requested for status code: {StatusCode}", statusCode);

        // Check if this is an API request (Accept header contains application/json)
        if (Request.Headers.Accept.Any(accept => accept?.Contains("application/json") ?? false))
        {
            return HandleApiError(statusCode);
        }

        // For HTML requests, return the appropriate Razor view
        return HandleRazorError(statusCode);
    }

    private ObjectResult HandleApiError(int statusCode)
    {
        var errorResponse = new
        {
            statusCode = statusCode,
            message = GetErrorMessage(statusCode),
            timestamp = DateTime.UtcNow,
            path = Request.Path,
            method = Request.Method
        };

        return StatusCode(statusCode, errorResponse);
    }

    private ViewResult HandleRazorError(int statusCode)
    {
        ViewData["StatusCode"] = statusCode;
        
        return statusCode switch
        {
            404 => View("NotFound"),
            500 => View("InternalServerError"),
            _ => View("Error")
        };
    }


    private static string GetErrorMessage(int statusCode)
    {
        return statusCode switch
        {
            400 => "Bad Request",
            401 => "Unauthorized",
            403 => "Forbidden",
            404 => "Not Found",
            500 => "Internal Server Error",
            502 => "Bad Gateway",
            503 => "Service Unavailable",
            _ => "An error occurred"
        };
    }
}

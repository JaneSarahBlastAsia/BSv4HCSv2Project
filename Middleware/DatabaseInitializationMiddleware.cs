using Microsoft.EntityFrameworkCore;
using CPortalv3.Data;

namespace CPortalv3.Middleware;

public class DatabaseInitializationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<DatabaseInitializationMiddleware> _logger;
    private static bool _isInitialized = false;
    private static readonly object _lock = new object();

    public DatabaseInitializationMiddleware(RequestDelegate next, ILogger<DatabaseInitializationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext, IWebHostEnvironment environment)
    {
        // Only initialize once per application lifetime
        if (!_isInitialized)
        {
            lock (_lock)
            {
                if (!_isInitialized)
                {
                    try
                    {
                        if (environment.IsProduction())
                        {
                            // In production, use Migrate() to apply migrations
                            dbContext.Database.Migrate();
                            _logger.LogInformation("Database migrations applied successfully in production.");
                        }
                        else
                        {
                            // In development, use EnsureCreated() for easier development
                            dbContext.Database.EnsureCreated();
                            _logger.LogInformation("Database created successfully in development.");
                        }

                        _logger.LogInformation("Database initialized successfully.");
                        _isInitialized = true;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "An error occurred while initializing the database");
                        // Don't set _isInitialized = true on error, so it can be retried
                    }
                }
            }
        }

        await _next(context);
    }
}

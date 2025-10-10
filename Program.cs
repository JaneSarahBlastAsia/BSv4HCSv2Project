using Microsoft.EntityFrameworkCore;
using CPortalv3.Data;
using CPortalv3.Middleware;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Razor Pages and MVC services for error pages
builder.Services.AddRazorPages();
builder.Services.AddMvc();

// Add Entity Framework services
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

// Add error handling for both development and production
app.UseExceptionHandler("/Error");
app.UseStatusCodePagesWithReExecute("/Error/{0}");

app.UseHttpsRedirection();

// Add database initialization middleware
app.UseMiddleware<DatabaseInitializationMiddleware>();


// Configure default files middleware with configurable default page
var defaultPage = builder.Configuration["StaticFiles:DefaultPage"] ?? "index.html";
app.UseDefaultFiles(new DefaultFilesOptions
{
    DefaultFileNames = [defaultPage]
});

// Enable static files serving from wwwroot
app.UseStaticFiles();

app.MapControllers();

app.Run();


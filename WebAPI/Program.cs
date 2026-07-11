using Microsoft.OpenApi.Models;
// using Microsoft.AspNetCore.Mvc;

// var builder = WebApplication.CreateBuilder(args);

// // Register controllers + filters BEFORE Build()
// builder.Services.AddControllers(options =>
// {
//     options.Filters.Add<CustomExceptionFilter>();
// });

// // Add Swagger services
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen(c =>
// {
//     c.SwaggerDoc("v1", new OpenApiInfo
//     {
//         Title = "Swagger Demo",
//         Version = "v1",
//         Description = "TBD",
//         TermsOfService = new Uri("https://example.com"),
//         Contact = new OpenApiContact
//         {
//             Name = "John Doe",
//             Email = "john@xyzmail.com",
//             Url = new Uri("https://www.example.com")
//         },
//         License = new OpenApiLicense
//         {
//             Name = "License Terms",
//             Url = new Uri("https://www.example.com")
//         }
//     });
// });

// var app = builder.Build();

// // Enable Swagger middleware
// app.UseSwagger();
// app.UseSwaggerUI(c =>
// {
//     c.SwaggerEndpoint("/swagger/v1/swagger.json", "Swagger Demo");
// });

// // ------------------- Values API -------------------
// List<string> dataStore = new() { "Value1", "Value2", "Value3" };

// app.MapGet("/api/values", () => Results.Ok(dataStore));

// app.MapGet("/api/values/{id:int}", (int id) =>
// {
//     if (id < 0 || id >= dataStore.Count)
//         return Results.BadRequest("Invalid ID provided.");
//     return Results.Ok(dataStore[id]);
// });

// app.MapPost("/api/values", (string newValue) =>
// {
//     if (string.IsNullOrEmpty(newValue))
//         return Results.BadRequest("Value cannot be empty.");
//     dataStore.Add(newValue);
//     return Results.StatusCode(StatusCodes.Status201Created);
// });

// // ------------------- Employee API -------------------
// List<string> employees = new() { "Alice", "Bob", "Charlie" };

// app.MapGet("/api/Emp", () => Results.Ok(employees))
//    .WithName("GetEmployees"); // user-friendly name

// app.MapPost("/api/Emp", (string newEmployee) =>
// {
//     if (string.IsNullOrEmpty(newEmployee))
//         return Results.BadRequest("Employee name cannot be empty.");
//     employees.Add(newEmployee);
//     return Results.StatusCode(StatusCodes.Status201Created);
// })
// .WithName("AddEmployee");

// // Map controllers (so your EmployeeController.cs works)
// app.MapControllers();

// app.Run();



using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ✅ Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// ✅ Register controllers + filters BEFORE Build
builder.Services.AddControllers(options =>
{
    options.Filters.Add<CustomExceptionFilter>();
});

// ✅ Configure JWT Authentication
string securityKey = "mysuperdupersecret";
var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, x =>
{
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "mySystem",
        ValidAudience = "myUsers",
        IssuerSigningKey = symmetricSecurityKey
    };
});

// ✅ Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Swagger Demo",
        Version = "v1",
        Description = "TBD",
        TermsOfService = new Uri("https://example.com"),
        Contact = new OpenApiContact
        {
            Name = "John Doe",
            Email = "john@xyzmail.com",
            Url = new Uri("https://www.example.com")
        },
        License = new OpenApiLicense
        {
            Name = "License Terms",
            Url = new Uri("https://www.example.com")
        }
    });
});

var app = builder.Build();

// ✅ Middleware order matters
app.UseCors("AllowLocalhost");
app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Swagger Demo");
});

app.MapControllers();

app.Run();

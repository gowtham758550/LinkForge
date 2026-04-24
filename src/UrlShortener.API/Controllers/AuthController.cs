using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using UrlShortener.API.Services;
using UrlShortener.Core.Interfaces;
using UrlShortener.Core.Models;

namespace UrlShortener.API.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IUserRepository users, JwtService jwt, IConfiguration config) : ControllerBase
{
    [HttpGet("google")]
    public IActionResult GoogleLogin()
    {
        // After Google signs in via /signin-google, redirect here to issue JWT
        var props = new AuthenticationProperties { RedirectUri = "/api/auth/callback" };
        return Challenge(props, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        // Read the cookie the Google middleware wrote after processing /signin-google
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!result.Succeeded) return Unauthorized();

        var googleId = result.Principal!.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var email    = result.Principal.FindFirstValue(ClaimTypes.Email)!;
        var name     = result.Principal.FindFirstValue(ClaimTypes.Name) ?? email;
        var picture  = result.Principal.FindFirstValue("picture")
                        ?? result.Principal.FindFirstValue("urn:google:picture");

        var user = await users.GetByGoogleIdAsync(googleId);
        if (user is null)
        {
            user = new AppUser { GoogleId = googleId, Email = email, Name = name, Picture = picture };
            await users.CreateAsync(user);
        }
        else if (user.Picture != picture && !string.IsNullOrEmpty(picture))
        {
            user.Picture = picture;
            await users.UpdateAsync(user);
        }

        // Done with the transient cookie — remove it
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        var token = jwt.Generate(user);
        var clientUrl = config["ClientUrl"]!;
        return Redirect($"{clientUrl}/auth/callback?token={token}");
    }

    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public IActionResult Me()
    {
        var userId  = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var email   = User.FindFirstValue(ClaimTypes.Email)!;
        var name    = User.FindFirstValue("name")!;
        var picture = User.FindFirstValue("picture");
        return Ok(new { id = userId, email, name, picture });
    }
}

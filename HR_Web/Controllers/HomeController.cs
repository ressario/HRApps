using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using HR_Web.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

namespace HR_Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
        [Authorize]
        public IActionResult Bunker()
        {
            return View();
        }
        public IActionResult Authenticate()
        {
            var randomClaims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name,"Tom"),
                new Claim(ClaimTypes.Email,"random@gmail.com"),
                new Claim("Check Random","Every Room"),
            };

            var fixedClaims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name,"Jerry"),
                new Claim("Fixed Idea","Square"),
            };

            var randomIdentity = new ClaimsIdentity(randomClaims,"Random Identity");
            var licenseIdentity = new ClaimsIdentity(fixedClaims,"Design");

            var userPrincipal = new ClaimsPrincipal(new[] { randomIdentity , licenseIdentity});

            HttpContext.SignInAsync(userPrincipal);

            return RedirectToAction("Index");
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

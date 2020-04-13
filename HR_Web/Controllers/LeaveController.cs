using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HR_Web.Controllers
{
    public class LeaveController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Submission()
        {
            return View();
        }
        public IActionResult Detail()
        {
            return View();
        }
    }
}
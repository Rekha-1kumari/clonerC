using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private static List<Employee> _employees = new List<Employee>
    {
        new Employee { Id = 1, Name = "Alice", Salary = 50000, Permanent = true },
        new Employee { Id = 2, Name = "Bob", Salary = 40000, Permanent = false },
        new Employee { Id = 3, Name = "Charlie", Salary = 60000, Permanent = true }
    };

    // ✅ GET all employees
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<List<Employee>> GetAll()
    {
        return Ok(_employees);
    }

    // ✅ PUT - Update employee
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<Employee> UpdateEmployee(int id, [FromBody] Employee updatedEmployee)
    {
        // Validation
        if (id <= 0)
            return BadRequest("Invalid employee id");

        var existing = _employees.FirstOrDefault(e => e.Id == id);
        if (existing == null)
            return BadRequest("Invalid employee id");

        // Update hardcoded list
        existing.Name = updatedEmployee.Name;
        existing.Salary = updatedEmployee.Salary;
        existing.Permanent = updatedEmployee.Permanent;
        existing.Department = updatedEmployee.Department;
        existing.Skills = updatedEmployee.Skills;
        existing.DateOfBirth = updatedEmployee.DateOfBirth;

        return Ok(existing);
    }

    // ✅ DELETE - Remove employee
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult DeleteEmployee(int id)
    {
        if (id <= 0)
            return BadRequest("Invalid employee id");

        var existing = _employees.FirstOrDefault(e => e.Id == id);
        if (existing == null)
            return BadRequest("Invalid employee id");

        _employees.Remove(existing);
        return Ok($"Employee {id} deleted successfully");
    }

    // ✅ POST - Add employee
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<Employee> AddEmployee([FromBody] Employee newEmployee)
    {
        if (newEmployee == null || newEmployee.Id <= 0)
            return BadRequest("Invalid employee data");

        _employees.Add(newEmployee);
        return CreatedAtAction(nameof(GetAll), new { id = newEmployee.Id }, newEmployee);
    }
}

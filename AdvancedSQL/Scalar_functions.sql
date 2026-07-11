DELIMITER $$

CREATE FUNCTION fn_CalculateAnnualSalary(empId INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE annualSalary DECIMAL(10,2);

    SELECT Salary * 12 INTO annualSalary
    FROM Employees
    WHERE EmployeeID = empId;

    RETURN annualSalary;
END$$

DELIMITER ;


SELECT fn_CalculateAnnualSalary(1) AS AnnualSalary;


SELECT 12 * Salary AS AnnualSalary FROM Employees WHERE EmployeeID = 1;

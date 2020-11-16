const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

init();

function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "Employee Role Update",
          value: "Employee_Role_Update"
        },
        {
          name: "Manager Employee Update",
          value: "Manager_Employee_Update"
        },
        {
          name: "View All Roles",
          value: "View_All_Roles"
        },
        {
          name: "Add Role",
          value: "Add_Role"
        },
        {
          name: "Remove Role",
          value: "Remove_Role"
        },
        {
          name: "View Departments",
          value: "View_Departments"
        },
        {
          name: "Department Removal",
          value: "Department_Removal"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]);

  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDepartment();
    case "VIEW_EMPLOYEES_BY_MANAGER":
      return viewEmployeesByManager();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    case "Employee_Role_Update":
      return (employeeRoleUpdate);
    case "Manager_Employee_Update":
      return (managerEmployeeUpdate);
    case "View_All_Roles":
      return (viewAllRoles);
    case "Add_Role":
      return (addRole);
    case "Remove_Role":
      return (removeRole);
    case "View_Departments":
      return (viewDepartments);
    case "Department_Removal":
      return (departmentRemoval);
    default:
      return quit();
  }
}

async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}

async function viewEmployeesByDepartment() {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to see employees for?",
      choices: departmentChoices
    }
  ]);

  const employees = await db.findAllEmployeesByDepartment(departmentId);

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}

async function viewEmployeesByManager() {
  const managers = await db.findAllEmployees();

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which employee do you want to see direct reports for?",
      choices: managerChoices
    }
  ]);

  const employees = await db.findAllEmployeesByManager(managerId);

  console.log("\n");

  if (employees.length === 0) {
    console.log("The selected employee has no direct reports");
  } else {
    console.table(employees);
  }

  loadMainPrompts();
}

async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);
}


async function removeEmployee() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Removed employee from the database");

  loadMainPrompts();
}

async function employeeRoleUpdate() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role needs updated?",
      choices: employeeChoices
    }
  ]);

  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "What is the role of this employee?",
      choices: roleChoices
    }
  ]);

  await db.employeeRoleUpdate(employeeId, roleId);

  console.log("Updated role of employee");

  loadMainPrompts();
}

async function managerEmployeeUpdate() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which managers role needs updated?",
      choices: employeeChoices
    }
  ]);

  const roles = await db.findAllPossibleManagers(employeeId);

  const managerChoices = managers.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which employee do you want to set as manager for the selectioed employees??",
      choices: managerChoices
    }
  ]);

  await db.employeeRoleUpdate(employeeId, managerId);

  console.log("Updated manager");

  loadMainPrompts();

}

async function viewAllRoles() {
  const roles = await db.findAllRoles();

  console.log("\n");
  console.table(roles);

  loadMainPrompts();
}

async function addRole() {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const role = await prompt([
    {
      name: "title",
      message: "Role name?"
    },
    {
      name: "salary",
      message: "What is the salary for this role?"
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department will the role be located?",
      choices: departmentChoices
    }
  ]);

  await db.createRole(role);

  console.log(` Added ${role.title} to the database`);

  loadMainPrompts();
}

async function removeRole() {
  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to PERMANENTLY remove?",
      choices: roleChoices
    }
  ]);

  await db.removeRole(roleId);

  console.log("Role removed from databse by request");

  loadMainPrompts();
}

async function viewDepartments() {
  const departments = await db.findAllDepartments();

  console.log("\n");
  console.table(departments);

  loadMainPrompts();
}

async function removeDepartments() {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const role = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department is being PERMANENTLY removed?",
      choices: departmentChoices
    }
  ]);

  await db.removeDepartment(departmentId);

  console.log(`Removed department from database by request`);

  loadMainPrompts();
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}

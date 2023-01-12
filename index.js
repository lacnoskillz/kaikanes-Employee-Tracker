const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const cTable = require('console.table');
let departments = ['Sales Department', 'Engineer Department', 'Accounting Department','Customer Service Department','Legal Department'];
let roles = ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Customer Service'];
let managerChoices = ["none"];
const questions = [{
  type: 'list',
  message: "what do you want to do?",
  name: 'whatdo',
  choices: ['View all employees', 'ADD Employee', 'Update Employee Role', 'View all roles', 'Add role', 'View All Departments','Add Department','Quit']
}];
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'hV0*Ly/K2NbG',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);
let employees = [];
let employees1 = db.query(`SELECT first_name, last_name FROM employee`, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result,"rsults");
  console.table(result);
  //init(questions);
});
employees.push(employees1);
console.log(employees,"emp after dbquery");

//  let managers = db.query(`SELECT * FROM employee`, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.table(result);
//   init(questions);
// });

//  console.log(managers);
//  let managerChoices = managers.map(({id,first_name,last_name}) => ({
//   name: `${first_name} ${last_name}`,
//   value: id
//  })); 
const employeequestion = [
  {
  type: 'input',
  message: "what is the new employees firstname?",
  name: 'employeeFN',
},
{
  type: 'input',
  message: "what is the new employees lastname?",
  name: 'employeeLN',
},
{
  type: 'list',
  message: 'What is the employees role?',
  name: 'employeeRole',
  choices: roles,
  
},
{
type: 'list',
message: 'Who is the employees manager? ',
name: 'employeeManager',
choices: managerChoices

}];

const departmentquestions = [
{
  type: 'input',
  message: "what is the name of the department?",
  name: 'departname',
}
];

const rolesquestions = [
  {
    type: 'input',
    message: "what is the name of the role?",
    name: 'rolename',
  },
  {
    type: 'input',
    message: "what is the salary of the role?",
    name: 'rolesalary',
  },
  {
    type: 'list',
    message: "which department does the role belong to?",
    name: 'roledepart',
    choices: departments
  }

  ];
  const updatequestion = [
    {
      type: 'list',
      message: "which employees role do you want to update?",
      name: 'employeeupdate',
      choices: employees
    },
  ]


function init(questions){
inquirer
  .prompt(questions)
  .then((data) => {
    if(data.whatdo == "View all employees"){
      db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
        init(questions);
      });
    }
    if(data.whatdo == "ADD Employee"){
      inquirer
      .prompt(employeequestion)
      .then((data)=>{
        console.log(data);
        console.log(data.employeeFN);
        let salary = db.query(`SELECT salary FROM role WHERE title="${data.employeeRole}"`);
        let departmentID = db.query(`SELECT department_id FROM role WHERE title="${data.employeeRole}"`);
        //console.log(departmentID);
        
        db.query(`INSERT INTO employee (first_name, last_name, tittle, department, salary, manager) VALUES ( "${data.employeeFN}", "${data.employeeLN}", "${data.employeeRole}","${departmentID}", "${data.employeeManager}"), "${salary}";`,(err, results) => {
          console.table(results);
          init(questions);
        });
        
      })
     
    }
    if(data.whatdo == "Update Employee Role"){

      init(questions);
    }
    if(data.whatdo == "View all roles"){
         db.query(`SELECT * FROM role`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
        init(questions);
      });
    }
    if(data.whatdo == "Add role"){
      inquirer
      .prompt(rolesquestions)
      .then((data)=>{
        console.log(data);
        console.log(data.employeeFN);
        roles.push(data.rolename);
        console.log(roles);
        db.query(`INSERT INTO role (title, salary) VALUES ( "${data.rolename}", "${data.rolesalary}");`,(err, results) => {
          console.table(results);
          init(questions);
        });
      }) 
     
    }
    if(data.whatdo == "View All Departments"){
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
        init(questions);
      });
    }
    if(data.whatdo == "Add Department"){
      inquirer
      .prompt(departmentquestions)
      .then((data)=>{
        console.log(data);
        console.log(data.departname);
        console.log(departments,"departments");
        departments.push(data.departname);
        console.log(departments);
        db.query(`INSERT INTO department (dep_name) VALUES ( "${data.departname}");`,(err, results) => {
          console.table(results);
          init(questions);
        });
      })
    }
    if(data.whatdo == "Quit"){
      console.log("exit program");
      return;
      
    }
  
  console.log(data);
  })
  .catch((error) => {
    if (error.isTtyError) {
      
    } else {
      
    }
  });
}
init(questions);
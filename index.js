const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const cTable = require('console.table');

const questions = [{
  type: 'list',
  message: "what do you want to do?",
  name: 'whatdo',
  choices: ['View all employees', 'ADD Employee', 'Update Employee Role', 'View all roles', 'Add role', 'View All Departments','Add Department','Quit']
}];
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
  choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Customer Service'],
  
},
{
type: 'list',
message: 'Who is the employees manager? ',
name: 'employeeManager',
choices: ['Bob',"Erik"],
}
];

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
    choices: []
  }

  ];
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'hV0*Ly/K2NbG',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

function init(questions){
inquirer
  .prompt(questions)
  .then((data) => {
    if(data.whatdo == "View all employees"){
      console.log("view employee ifstatement working");
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
        db.query(`INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ( ${data.employeeFN}, ${data.employeeLN}, 125, 54);`,(err, results) => {
          console.log(results);
        });
        init(questions);
      })
     
    }
    if(data.whatdo == "Update Employee Role"){
      console.log("Update role workig");
      init(questions);
    }
    if(data.whatdo == "View all roles"){
      console.log("view roles working");
      init(questions);
    }
    if(data.whatdo == "Add role"){
      console.log("add roll");
      init(questions);
    }
    if(data.whatdo == "View All Departments"){
      console.log("view departments");
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
        init(questions);
      });
    }
    if(data.whatdo == "Add Department"){
      console.log("add department");
      inquirer
      .prompt(departmentquestions)
      .then((data)=>{
        console.log(data);
        db.query(`INSERT INTO department (name) VALUES ( ${data.departname});`,(err, results) => {
          console.log(results);
        });
        init(questions);
      })
    }
    if(data.whatdo == "Quit"){
      console.log("exit program");
      return;
      
    }
  //do something with data
  console.log(data);
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
}
init(questions);
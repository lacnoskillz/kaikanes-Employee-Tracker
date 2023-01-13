const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const cTable = require('console.table');
let departments = ['Sales Department', 'Engineer Department', 'Accounting Department', 'Customer Service Department', 'Legal Department'];
let roles = ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Customer Service'];
let managerChoices = ["none"];


const initialquestions = [{
  type: 'list',
  message: "what do you want to do?",
  name: 'whatdo',
  choices: ['View all employees', 'ADD Employee', 'Update Employee Role', 'View all roles', 'Add role', 'View All Departments', 'Add Department', 'Quit']
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
let employeesfinal = [];
//goes through all first and last names and converts it to an array so it can be used in inquirer
function namelist() {
  db.query(`SELECT first_name, last_name FROM employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    employees = result;

    for (var i = 0; i < employees.length; i++) {
      let propertyValues = Object.values(employees[i]);
      let empstring = propertyValues.toString("");
      empstring = empstring.replaceAll(',', ' ');
      employeesfinal.push(empstring);
    }
    ;
    return employeesfinal;
  });

}
namelist();
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
    choices: employeesfinal,
  },
  {
    type: 'list',
    message: "which role do you want to assign the selected employee?",
    name: 'employeeupdaterole',
    choices: roles
  },
]


function init(questions) {
  inquirer
    .prompt(questions)
    .then((data) => {
      if (data.whatdo == "View all employees") {
        db.query(`SELECT * FROM employee`, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
          init(initialquestions);
        });
      }
      if (data.whatdo == "ADD Employee") {
        inquirer
          .prompt(employeequestion)
          .then((data) => {
            console.log(data);
            console.log(data.employeeFN);
            console.log(data.employeeRole);
            let salary = 0;
            db.query(`SELECT salary FROM role WHERE title="${data.employeeRole}"`, (err, result) => {
              if (err) {
                console.log(err);
              }

              console.log(salary, "salary");
              let str = JSON.stringify(result);
              let newstr = str.match(/\d/g);
              newstr = newstr.join("");
              salary = parseInt(newstr);
              console.log(salary, "salary");
              departmetnIDfunction();
            });
            function departmetnIDfunction() {
              db.query(`SELECT department_id FROM role WHERE title="${data.employeeRole}"`, (err, result) => {
                if (err) {
                  console.log(err);
                }
                let depID = 0;
                depID = result;
                console.log(depID, "depID");
                let str = JSON.stringify(depID);
                let newstr = str.match(/\d/g);
                newstr = newstr.join("");
                depID = parseInt(newstr);
                console.log(depID, "depID");
                getdepartmentname(depID);
              });
            }
            function getdepartmentname(depID) {
              db.query(`SELECT dep_name FROM department WHERE id="${depID}"`, (err, result) => {
                let depname = result;
                console.log(depname, "depname");
                let propertyValues = [];
                propertyValues = Object.values(depname[0]);

                console.log(propertyValues[0]);
                Insertemployee(propertyValues[0]);
              })
            }
            function Insertemployee(departname) {
             console.log(data.employeeFN,"FN");
             if(data.employeeManager == "none"){
              let anewmanager = data.employeeFN + " "+ data.employeeLN;
              console.log(anewmanager,"adding");
              managerChoices.push(anewmanager);
              console.log(managerChoices,"managerschoices");
             }
             
              db.query(`INSERT INTO employee (first_name, last_name, title, department, salary, Managername) VALUES ("${data.employeeFN}","${data.employeeLN}", "${data.employeeRole}", "${departname}", ${salary}, "${data.employeeManager}");`, (err, results) => {
                console.table(results);
                //starts the inititalquestions prompt again
                //runs function namelist to update with added employee
                namelist();
                init(initialquestions);
              });
            }
         
          });
      }
      if (data.whatdo == "Update Employee Role") {

        inquirer
          .prompt(updatequestion)
          .then((data) => {
            console.log(data);
            console.log(data.employeeupdate,"name?");
            let str = data.employeeupdate;
            console.log(str,"str");
           const arry = str.split(' ');
           console.log(arry,"arry");
            let FN = arry[0];
            let LN = arry[1];
            console.log(FN);
            console.log(LN);
            //AND last_name="${LN}"
            db.query(`UPDATE employee SET title=${data.employeeupdaterole} WHERE first_name ="${FN}"`, (err, results) => {
              
              init(questions);
            });

          })

      }
      if (data.whatdo == "View all roles") {
        db.query(`SELECT * FROM role`, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
          init(initialquestions);
        });
      }
      if (data.whatdo == "Add role") {
        inquirer
          .prompt(rolesquestions)
          .then((data) => {
            //adds the role name user enters into the array roles
            roles.push(data.rolename);
            //let departid == to the department user input
            let departid;
            departid = data.roledepart;
            //selects the id from the department the user input and converts the object to string then string to just the number then that string number to integer
            db.query(`SELECT id FROM department WHERE dep_name="${departid}"`, (err, results) => {
              console.log(results, "results");
              str = JSON.stringify(results);
              let newstr = str.match(/\d/g);
              newstr = newstr.join("");
              console.log(newstr, "final");
              departid = parseInt(newstr);
              console.log(departid);

              //sends the number extracted to the function InsertRole
              InsertRole(departid);
            });
            //inserts new rolename/salary of that role and department id
            function InsertRole(departid) {
              console.log(data.roledepart, "roledepart");
              db.query(`INSERT INTO role (title, salary, department_id) VALUES ( "${data.rolename}", "${data.rolesalary}", "${departid}");`, (err, results) => {
                console.table(results);
                //starts the inititalquestions prompt again
                init(initialquestions);
              });
            }
          })

      }
      if (data.whatdo == "View All Departments") {
        db.query(`SELECT * FROM department`, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
          init(initialquestions);
        });
      }
      if (data.whatdo == "Add Department") {
        inquirer
          .prompt(departmentquestions)
          .then((data) => {
            departments.push(data.departname);
            db.query(`INSERT INTO department (dep_name) VALUES ( "${data.departname}");`, (err, results) => {
              console.table(results);
              init(initialquestions);
            });
          })
      }
      if (data.whatdo == "Quit") {
        console.log("exit program");


      }

    })
    .catch((error) => {
      if (error.isTtyError) {

      } else {

      }
    });
}

init(initialquestions);

// if(data.employeeManager == "none"){
//   data.employeeFN
//   data.employeeLN
//   managerChoices.push()
//}

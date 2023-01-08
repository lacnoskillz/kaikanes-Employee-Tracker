const inquirer = require('inquirer');
const fs = require('fs');
inquirer
  .prompt([
    {
    type: 'list',
    message: "what do you want to do?",
    name: 'whatdo',
    choices: ['View all employees', 'ADD Employee', 'Update Employee Role', 'View all roles', 'Add role', 'View All Departments','Add Department','Quit']
}
  ])
  .then((data) => {
    if(data.whatdo == "View all employees"){
      console.log("view employee ifstatement working");
    }
    if(data.whatdo == "ADD Employee"){
      console.log("add emplyee if statement working");
    }
    if(data.whatdo == "Update Employee Role"){
      console.log("Update role workig");
    }
    if(data.whatdo == "View all roles"){
      console.log("view roles working");
    }
    if(data.whatdo == "Add role"){
      console.log("add roll");
    }
    if(data.whatdo == "View All Departments"){
      console.log("view departments");
    }
    if(data.whatdo == "Add Department"){
      console.log("add department");
    }
    if(data.whatdo == "Quit"){
      console.log("exit program");
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
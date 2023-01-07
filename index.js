const inquirer = require('inquirer');
const fs = require('fs');
inquirer
  .prompt([
    {
    type: 'list',
    message: "what do you want to do?",
    name: 'whatdo',
    choices: ['View all employees', 'ADD Employee', 'Updadte Employee Role', 'View all roles', 'Add role', 'View All Departments','Add Department','Quit']
}
  ])
  .then((data) => {
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
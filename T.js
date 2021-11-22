const inquirer = require("inquirer");


inquirer.prompt({
  type: "list",
  name: "X",
  choices: ["A", "B", "C"]
}).then(r => {
  console.log(r);
});
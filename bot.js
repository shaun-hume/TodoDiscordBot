var Discord = require("discord.js");
var logger = require("winston");
var Todo = require("./models/todo.js");
var TodoHandler = require("./handlers/todoHandler.js");
const config = require('./config.json');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";
var bot = new Discord.Client();
bot.once('ready', () => {
  console.log('Ready!');
});

bot.login(config.token);

bot.on("message", message => {
  if (message.content.substring(0, 1) == "!") {
    const args = message.content.slice(1).trim().split(' ');
    const command = args.shift().toLowerCase();

    switch (command) {
      case "new":
        let todo = new Todo(args[0], args[1]);
        try {
          TodoHandler.newTodo(todo, message.author.id);
          message.author.send("The following todo has been created: " + JSON.stringify(todo));
        }
        catch (err) {
          console.log(err);
          message.author.send("There was an error trying to add the following todo. Try again?: " + JSON.stringify(todo));
        }
        break;

      case "list":
        TodoHandler.listTodos(message.author.id).then((todos) => message.author.send("These are your incomplete todos: \n" + todos))
          .catch((err) => {
            console.log(err);
            if (err.code == 'ENOENT') {
              message.author.send("You don't have any todos! Add one by typing !new <title> <datedue>");
            }
            else {
              message.author.send("There was an error retrieving your todos. Try again?");
            }
          });
        break;
    }
  }
});
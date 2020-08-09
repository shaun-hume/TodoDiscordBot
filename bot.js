var Discord = require("discord.js");
var logger = require("winston");
var fs = require("fs");
const config = require('./config.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";
// Initialize Discord Bot
var bot = new Discord.Client();
bot.once('ready', () => {
  console.log('Ready!');
});

bot.login(config.token);

bot.on("ready", function (evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});
bot.on("message", message => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.content.substring(0, 1) == "!") {
    const args = message.content.slice(1).trim().split(' ');
    const command = args.shift().toLowerCase();

    switch (command) {
      case "ping":
        message.author.send("Pong!");
        break;
      case "newtodo":
        var todoText = args[0] + (args[1] != null ? " , " + args[1] : "");
        message.author.send("The following todo has been created:" + todoText);
        fs.appendFile(message.author.id + ".txt", "\r\n" + todoText, function (err) {
              if (err) {
                console.log(err);
              }
              console.log("Appended to File and Saved!");
        });
        break;
      case "listtodos":
        var todoList = fs.readFileSync(message.author.id + ".txt", function (err, data) {
          if (err) return "No Todos";
          console.log(data);
          return data;
        });
        message.author.send(todoList);
        break;
    }
  }
});
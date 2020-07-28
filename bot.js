var Discord = require("discord.io");
var logger = require("winston");
var auth = require("./auth.json");
var fs = require("fs");

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";
// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true,
});
bot.on("ready", function (evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});
bot.on("message", function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == "!") {
    var args = message.substring(1).split(" | ");
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      // !ping
      case "ping":
        bot.sendMessage({
          to: channelID,
          message: "Pong!",
        });
      case "describe":
        bot.sendMessage({
          to: channelID,
          message: "DinomitronDesigns created me. I want to be famous!",
        });
      case "newtodo":
        var todoText = args[0] + " , " + args[1];
        bot.sendMessage({
          to: userID,
          message: "The following todo has been created:" + todoText,
        });
        fs.appendFile(userID + ".txt", "\r\n" + todoText, function (err) {
          if (err) throw err;
          console.log("Saved!");
        });
      case "listtodos":
        var todoList = fs.readFileSync(userID + ".txt", function (err, data) {
          if (err) return "No Todos";
          console.log(data);
          return data;
        });
        bot.sendMessage({
          to: userID,
          message: todoList,
        });
        break;
    }
  }
});

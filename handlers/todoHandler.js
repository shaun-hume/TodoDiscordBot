var fs = require("fs");
const { rejects } = require("assert");

function newTodo(todo, authorId) {
    var todoArray = [];

    fs.stat("todofiles/" + authorId + ".txt", function (err) {
        if (err) {
            todoArray.push(todo);
            fs.writeFile("todofiles/" + authorId + ".txt", JSON.stringify(todoArray), function (err) {
                if (err) { throw err; }
                console.log("New File Written to and Saved!");
            });
        }
        else {
            fs.readFile("todofiles/" + authorId + ".txt", function (err, data) {
                if (err) { throw err; }
                todoArray = JSON.parse(data);
                todoArray.push(todo);
                fs.writeFile("todofiles/" + authorId + ".txt", JSON.stringify(todoArray), function (err) {
                    if (err) { throw err; }
                    console.log("File Appended to and Saved!");
                });
            });
        }
    });
}

function listTodos(authorId) {
    return new Promise((resolve, reject) => {
        fs.readFile("todofiles/" + authorId + ".txt", function (err, data) {
            var todos = "";
            if (err) { reject(err); }
            else {
                todoArray = JSON.parse(data);
                todoArray.map(todo => {
                    todos = todos + todo.title + "\n";
                });
                resolve(todos)
            }
        });
    });
}

module.exports = { newTodo, listTodos }
class Todo {
    constructor(title, dueDate) {
        const { v4: uuidv4 } = require('uuid');

        this.id = uuidv4();
        this.title = title;
        this.dueDate = dueDate;
    }
}

module.exports = Todo
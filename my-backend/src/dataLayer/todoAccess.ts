import { TodoItem } from '../models/TodoItem';

export class TodoAccess {

    constructor(private todoItem: TodoItem[] = []){};

    async getAllTodos(): Promise<TodoItem[]> {
        //return this._icon;
        const timestamp = new Date().toISOString();

        this.todoItem.push({
            userId: "Oauth-1232",
            todoId: "1",
            createdAt: "2019-07-29T20:01:45.424Z",
            name: "Go to the Gym",
            dueDate: timestamp,
            done: false,
            attachmentUrl: "http://example.com/image.png"
        });
        this.todoItem.push({
            userId: "Oauth-1232",
            todoId: "2",
            createdAt: "2019-07-29T20:01:45.424Z",
            name: "Go to the Mall",
            dueDate: timestamp,
            done: false,
            attachmentUrl: "http://example.com/image.png"
        });
        this.todoItem.push({
            userId: "Oauth-1232",
            todoId: "3",
            createdAt: "2019-07-29T20:01:45.424Z",
            name: "Go to the Bed",
            dueDate: timestamp,
            done: false,
            attachmentUrl: "http://example.com/image.png"
        });
        
          return this.todoItem as TodoItem[];
    };


}
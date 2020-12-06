import { TodoItem } from '../models/TodoItem';
import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'


export class TodoAccess {

    constructor(
        private logger: any = createLogger('dataLayer'),
        private pid = uuid.v4(),
        private readonly docClient: DocumentClient = TodoAccess.createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE){};

    async getAllTodos(): Promise<TodoItem[]> {

        this.logger.info('Getting all todos', {
            // Additional information stored with a log statement
            pid: this.pid
        })

        const result = await this.docClient.scan({
            TableName: this.todosTable
        }).promise()

        const todoItems = result.Items
        
        return todoItems as TodoItem[];
    };

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {

        this.logger.info('Creating a todo item', {
            pid: this.pid
        })

        await this.docClient.put({
          TableName: this.todosTable,
          Item: todoItem
        }).promise()
    
        return todoItem
    }

    static createDynamoDBClient() {
        return new AWS.DynamoDB.DocumentClient()
    }


}
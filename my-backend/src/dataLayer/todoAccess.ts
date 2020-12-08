import { TodoItem } from '../models/TodoItem';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'


export class TodoAccess {

    constructor(
        private logger: any = createLogger('dataLayer'),
        private pid = uuid.v4(),
        private readonly docClient: DocumentClient = TodoAccess.createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly urlExpiration = +process.env.SIGNED_URL_EXPIRATION //convert string to number with the plus sign
        ){};

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

    createS3Client() {
        return new AWS.S3({
            signatureVersion: 'v4'
        })
    }

    get getBucketName() {
        return process.env.IMAGES_S3_BUCKET
    }

    getUploadUrl(imageId: string) {

        this.logger.info('Getting PreSignedURL', {
            pid: this.pid
        })

        return this.createS3Client().getSignedUrl('putObject', {
          Bucket: this.bucketName,
          Key: imageId,
          Expires: this.urlExpiration
        })
    }

    async updateTodo(todoId: string, todoUpdate: UpdateTodoRequest): Promise<void> {

        this.logger.info('Updating Todo', {
            pid: this.pid
        })

        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: {todoId: todoId},
            UpdateExpression: 'set #todo_name = :newName, dueDate=:newDueDate, done=:newDone', //for some reason i can't use 'name' as as attribute value. I had to use #todo_name and later set the actual name i want
            ExpressionAttributeNames: {'#todo_name': 'name'}, //renaming the #todo_name to the actual name i want it to have in the DB
            ExpressionAttributeValues: {
                ':newName': todoUpdate.name,
                ':newDueDate': todoUpdate.dueDate,
                ':newDone': todoUpdate.done
            },
            ReturnValues: 'ALL_NEW' //UPDATED_NEW this value will return the updated field while ALL_NEW wil return the whole filed with updated value
        }).promise()

        this.logger.info('UpdateResult: ', {
            pid: this.pid,
            result: result.Attributes as TodoItem
        })

    }

    async deleteTodo(todoId: string) {
        this.logger.info('Deleting a todo', {
            pid: this.pid,
            todoId: todoId
        });
    
        await this.docClient.delete({
          TableName: this.todosTable,
          Key: {
            todoId: todoId
          }
        }).promise();
    
        this.logger.info('DeleteItem succeeded')
    }

}
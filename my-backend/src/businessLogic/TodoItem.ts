import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
//import { ImageAccess } from '../dataLayer/fileAccess';

import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import * as uuid from 'uuid'

import { createLogger } from '../utils/logger';

const logger = createLogger('todosBusinessLogic');

const todoAccess = new TodoAccess()

export async function getAllTodos(userID: string): Promise<TodoItem[]> {
  //const userId = "Oauth-12345"

    return todoAccess.getAllTodos(userID)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userID: string
  ): Promise<TodoItem> {
    logger.info('Entering Business Logic function');

    const itemId = uuid.v4()
    //const userId = "Oauth-12345"

    return await todoAccess.createTodo({
        userId: userID,
        todoId: itemId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        //attachmentUrl: `https://${todoAccess.getBucketName}.s3.amazonaws.com/${itemId}` to avoid loading images that dont exist we update this url when we the getSigneUrl lambda is called
      })
  }

  export async function getUploadUrl(userId: string, todoId: string): Promise<string> {

    logger.info('Entering Business Logic function');

    // Write final url to datastore
    await todoAccess.updateTodoUrl(userId, todoId)

    //return {uploadUrl: todoAccess.getUploadUrl(todoId)}
    return todoAccess.getUploadUrl(todoId)
  }

  export async function updateTodo(
    userID: string,
    todoId: string,
    todoUpdate: UpdateTodoRequest
  ): Promise<void> {
    logger.info('Entering Business Logic function');
    //const userId = "Oauth-12345"
    return await todoAccess.updateTodo(userID, todoId,{
      name: todoUpdate.name,
      dueDate: todoUpdate.dueDate,
      done: todoUpdate.done
    })
  }

  export async function deleteTodo(userID: string, todoId: string): Promise<void>{
    logger.info('Entering Business Logic function');
    //const userId = "Oauth-12345"
    return await todoAccess.deleteTodo(userID, todoId)
  }
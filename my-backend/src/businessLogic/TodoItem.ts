import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import * as uuid from 'uuid'

const todoAccess = new TodoAccess()

export async function getAllTodos(userID: string): Promise<TodoItem[]> {
  //const userId = "Oauth-12345"

    return todoAccess.getAllTodos(userID)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userID: string
  ): Promise<TodoItem> {

    const itemId = uuid.v4()
    //const userId = "Oauth-12345"

    return await todoAccess.createTodo({
        userId: userID,
        todoId: itemId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: `https://${todoAccess.getBucketName}.s3.amazonaws.com/${itemId}`
      })
  }

  export async function getUploadUrl(todoId: string): Promise<string> {
    //return {uploadUrl: todoAccess.getUploadUrl(todoId)}
    return todoAccess.getUploadUrl(todoId)
  }

  export async function updateTodo(
    userID: string,
    todoId: string,
    todoUpdate: UpdateTodoRequest
  ): Promise<void> {
    //const userId = "Oauth-12345"
    return await todoAccess.updateTodo(userID, todoId,{
      name: todoUpdate.name,
      dueDate: todoUpdate.dueDate,
      done: todoUpdate.done
    })
  }

  export async function deleteTodo(userID: string, todoId: string): Promise<void>{
    //const userId = "Oauth-12345"
    return await todoAccess.deleteTodo(userID, todoId)
  }
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'

const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
    return todoAccess.getAllTodos()
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
  ): Promise<TodoItem> {

    const itemId = uuid.v4()
    const userId = "Oauth-12345"

    return await todoAccess.createTodo({
        userId: userId,
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
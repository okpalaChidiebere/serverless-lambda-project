import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/TodoItem'
import { createLogger } from '../../utils/logger';
import { getToken, parseUserId } from '../../auth/utils';

const logger = createLogger('getTodos');


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', {event: event});

  const authHeader = event.headers.Authorization
  const jwtToken = getToken(authHeader);
  const userId = parseUserId(jwtToken);
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const result = await updateTodo(userId, todoId, updatedTodo)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      result
    })
  }
}
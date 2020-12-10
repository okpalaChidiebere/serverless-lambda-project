
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/TodoItem'
import { createLogger } from '../../utils/logger';
import { getToken, parseUserId } from '../../auth/utils';

const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', {event: event});

  const authHeader = event.headers.Authorization // will this get the Bearer Tken ??
  const jwtToken = getToken(authHeader);
  const userId = parseUserId(jwtToken);
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const newItem = await createTodo(newTodo, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      newItem
    })
  }
}
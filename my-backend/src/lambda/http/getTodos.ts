import 'source-map-support/register'
import { getAllTodos } from '../../businessLogic/TodoItem'
import { createLogger } from '../../utils/logger';
import { getToken, parseUserId } from '../../auth/utils';

const logger = createLogger('getTodos');

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', {event: event});

  const authHeader = event.headers.Authorization
  const jwtToken = getToken(authHeader);
  const userId = parseUserId(jwtToken);

  // TODO: Get all TODO items for a current user
  const todos = await getAllTodos(userId)

  if(todos.length !== 0){
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todos
    })
  };
  }

  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }

}
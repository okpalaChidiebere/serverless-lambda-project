
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getUploadUrl } from '../../businessLogic/TodoItem'
import { createLogger } from '../../utils/logger';
import { getToken, parseUserId } from '../../auth/utils';

const logger = createLogger('generateUploadUrl');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', {event: event});

  const authHeader = event.headers.Authorization
  const jwtToken = getToken(authHeader);
  const userId = parseUserId(jwtToken);
  const todoId = event.pathParameters.todoId

  const uploadUrl = await getUploadUrl(userId, todoId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
        uploadUrl
    })
  }

}
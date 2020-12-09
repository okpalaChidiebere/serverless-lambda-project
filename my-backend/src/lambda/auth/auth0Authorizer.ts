import { APIGatewayTokenAuthorizerEvent , CustomAuthorizerResult, APIGatewayAuthorizerHandler  } from 'aws-lambda'
import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
import * as uuid from 'uuid'


const logger = createLogger('auth')
const pId = uuid.v4()

export const handler: APIGatewayAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent): Promise<CustomAuthorizerResult> => {


    //export type APIGatewayAuthorizerEvent = APIGatewayTokenAuthorizerEvent | APIGatewayRequestAuthorizerEvent;
    //https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-input.html 
    logger.info('Authorizing a user: ', {
        event: event.authorizationToken,
        pid: pId 
    })
    try {
        verifyToken(event.authorizationToken)
        logger.info('User was authorized: ', {
            event: event.authorizationToken,
            pid: pId 
        })
    
        return { ////return a policy that will allow the user access to any Lambda functions
          principalId: 'user',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: '*' //we can specify the arn(s) of the labda functions if we want
              }
            ]
          }
        }
      } catch (e) { //we catch any error thrown by the verifyToken function and we know the user was not authorized
        logger.error('User not authorized', { 
            error: e.message,
            pid: pId
         })

    
        return { //return a policy that will deny the user access to any Lambda functions
          principalId: 'user',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Action: 'execute-api:Invoke',
                Effect: 'Deny',
                Resource: '*'
              }
            ]
          }
        }
      }
    
    function verifyToken(authHeader: string){ //returns void
        if (!authHeader)
          throw new Error('No authentication header')
      
        if (!authHeader.toLowerCase().startsWith('bearer '))
          throw new Error('Invalid authentication header')
      
        const split = authHeader.split(' ')
        const token = split[1]

        if(token !== '123')  //mock id for now. We will later change this to actual token
           throw new Error('Invalid toekn')


        //A request has been authorised
    }
      
    
}
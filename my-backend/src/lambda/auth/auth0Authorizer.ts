import { APIGatewayTokenAuthorizerEvent , CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
import * as uuid from 'uuid'
import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../auth/JwtPayload'
import * as middy from 'middy'
import { secretsManager } from 'middy/middlewares' //secretManager in middleware helps us read and cache secrets from AWS Secret Manager instead of us having to get the secrets fro aws-sdk ourselves

const secretId = process.env.AUTH_0_SECRET_ID
const secretField = process.env.AUTH_0_SECRET_FIELD

const logger = createLogger('auth')
const pId = uuid.v4()

export const handler = middy(async (event: APIGatewayTokenAuthorizerEvent, context): Promise<CustomAuthorizerResult> => { //middy stores the secrets in the context param where we can read any secretField from


    //export type APIGatewayAuthorizerEvent = APIGatewayTokenAuthorizerEvent | APIGatewayRequestAuthorizerEvent;
    //https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-input.html 
    logger.info('Authorizing a user: ', {
        event: event.authorizationToken,
        pid: pId 
    })
    
    
    try {
      const decodedToken = await verifyToken(event.authorizationToken, context.AUTH0_SECRET[secretField])
        logger.info('User was authorized: ', {
            event: event.authorizationToken,
            pid: pId 
        })
    
        return { ////return a policy that will allow the user access to any Lambda functions
          principalId: decodedToken.sub, //sub is the ID of user that pass authentication with Auth0
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
         
})

async function verifyToken(authHeader: string, auth0Secret: string): Promise<JwtPayload>{ //returns jwt token
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, auth0Secret) as JwtPayload //we verify the result and cast the result into the token format

  //A request has been authorised
}

handler.use(
  secretsManager({
    awsSdkOptions: { region: 'ca-central-1' },
    cache: true, //cache the secret value
    cacheExpiryInMillis: 60000, //cache the result for one minute
    throwOnFailedCall: true,  // Throw an error if can't read the secret
    secrets: {  //what secrets to fetch
      AUTH0_SECRET: secretId //we fetch the secret with secretId and store it in AUTH0_SECRET field
    }
  })
)
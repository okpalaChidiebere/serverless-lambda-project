import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'serverless-todo-app',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: "${opt:stage, 'dev'}",
    region: "ca-central-1",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      TODOS_TABLE: 'Todos-${self:provider.stage}', //we will get Todos-dev. Serverless will go to the provider section, then get the stage value
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:Scan",
          "dynamodb:PutItem",
        ],
        Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}"
      },
    ]
  
  },
  functions: {
    GetTodos: {
      handler: 'src/lambda/http/getTodos.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'todos',
            cors: true,
          }
        }
      ]
    },
    CreateTodo: {
      handler: "src/lambda/http/createTodo.handler",
      events: [
        {
          http: {
            method: "post",
            path: "todos",
            cors: true,
          }
        }
      ]
    },
  },
  resources: {
    Resources: {
      TodosDynamoDBTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: "todoId",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: "todoId", //partitionKey
              KeyType: "HASH"
            }
          ],
          BillingMode: "PAY_PER_REQUEST",
          TableName: "${self:provider.environment.TODOS_TABLE}"
        }
      }
    }
  }
}

module.exports = serverlessConfiguration;

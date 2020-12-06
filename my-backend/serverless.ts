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
    },
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
    }
  }
}

module.exports = serverlessConfiguration;

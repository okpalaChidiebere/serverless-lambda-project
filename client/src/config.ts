// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'qicjorg542'
export const apiEndpoint = `https://${apiId}.execute-api.ca-central-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-1k78x7pq.us.auth0.com',            // Auth0 domain
  clientId: 'rxtkcEtAxSwoc1E3XdYj7ZiiJfhFzOBk',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

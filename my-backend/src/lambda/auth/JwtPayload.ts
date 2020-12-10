/**
 * A payload of a JWT token
 * 
 * inside here you can add more nformation about the user, like permissions and aothers so that you can know authenticate and authorize requests
 */
export interface JwtPayload {
    iss: string
    sub: string
    iat: number
    exp: number
  }
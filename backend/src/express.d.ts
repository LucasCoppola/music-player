import { UserPayload } from './auth/auth.controller';

declare module 'express' {
  interface Request {
    user?: UserPayload;
  }
}

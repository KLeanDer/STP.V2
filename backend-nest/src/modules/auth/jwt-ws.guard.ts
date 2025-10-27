import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Socket } from 'socket.io';

@Injectable()
export class JwtWsGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const authHeader =
      (client.handshake.headers?.authorization as string | undefined) ?? null;
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader
      : undefined;

    const tokenFromAuth = client.handshake.auth?.token as string | undefined;
    const tokenFromQuery = client.handshake.query?.token as string | undefined;

    const token = tokenFromHeader
      ? tokenFromHeader
      : tokenFromAuth
      ? `Bearer ${tokenFromAuth}`
      : tokenFromQuery
      ? `Bearer ${tokenFromQuery}`
      : undefined;

    return {
      headers: {
        authorization: token,
      },
    } as unknown as Request;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const client = context.switchToWs().getClient<Socket>();
    client.data.userId = user.userId;

    return user;
  }
}

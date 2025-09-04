/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'] as
      | string
      | undefined;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant');
    }

    const token = authHeader.slice('Bearer '.length);
    try {
      const secret = process.env.JWT_SECRET || 'fallback-secret';
      const payload = jwt.verify(token, secret);
      // Attache le payload au request pour un usage ultérieur (e.g. req.user)
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token invalide');
    }
  }
}

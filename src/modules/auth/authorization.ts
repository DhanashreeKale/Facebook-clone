import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class Authorization {
  async getPayloadIdFromToken(authorization): Promise<string> {
    const token = authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token, { complete: true });
    const payloadId = decodedToken['payload']['sub'];
    if (!payloadId)
      throw new UnauthorizedException(`payloadId from token is required`);
    return payloadId;
  }
}

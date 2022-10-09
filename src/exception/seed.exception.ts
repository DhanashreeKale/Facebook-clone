import { HttpException, HttpStatus } from '@nestjs/common';

export class SeedException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}

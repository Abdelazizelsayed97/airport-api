import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}
  signUp() {
    return 'This action adds a new auth';
  }
  signIn() {
    return `This action returns all auth`;
  }
}

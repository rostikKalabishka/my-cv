import { Injectable, BadRequestException } from '@nestjs/common';

import { UsersService } from './user.service';

import { randomBytes, scrypt as _scrypt } from 'crypto';

import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signUp(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException(
        'The user with this email address already exist',
      );
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const newUser = await this.usersService.create(email, result);

    return newUser;
  }

  signIn() {}
}

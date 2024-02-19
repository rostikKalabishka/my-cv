import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

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

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('The user with this address does not exist');
    }
    //деструктуризація (беремо весь пароль і сплітим черех ".", так визначаєм саму сіль і хеш)
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }
    return user;
  }
  async signOut() {}
}

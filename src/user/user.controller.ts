import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';

import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from 'src/user/dtos/user.dto';
import { AuthService } from './auth.service';
@Controller('auth')
@Serialize(UserDto)
export class UserController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.authService.signUp(body.email, body.password);
  }

  // @Post('/signin')
  // signIp(@Body() body: CreateUserDto) {
  //   this.authService.signIn();
  // }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}

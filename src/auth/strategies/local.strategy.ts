import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.userService.validateUser(email, password);

    const userObject = this.userService.stripSensitiveProps(user.toObject());

    return userObject;
  }
}

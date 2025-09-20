import {
  Controller,
  Post,
  Body, Get
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
import { AccountLogin, AccountRegister } from '@e-shop/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Get('test')
  // test(){
  //   return {message: 'test'}
  // }

  // @Post('register')
  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  register(@Body() dto: AccountRegister.Request):Promise<AccountRegister.Response> {
    return this.authService.register(dto);
  }

  // @Post('login')
  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  login(@Body() dto: AccountLogin.Request) {
    return this.authService.login(dto);
  }

  // @Post('logout')
  // logout() {
  //   console.log('logout')
  //   return this.authService.logout();
  // }

}

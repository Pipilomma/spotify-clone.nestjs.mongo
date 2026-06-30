import { Body, Controller, Post, UseGuards, Request } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/auth-local.guard";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";

@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post("/register")
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
}
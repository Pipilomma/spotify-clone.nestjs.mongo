import { Body, Controller, Post, UseGuards, Request, UseInterceptors, UploadedFiles } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/auth-local.guard";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post("/register")
  @UseInterceptors(FileFieldsInterceptor([
          { name: 'avatar', maxCount: 1 },
      ]))
  register(@Body() dto: CreateUserDto, @UploadedFiles() files) {
    const {avatar} = files;

    return this.authService.register(dto, avatar[0]);
  }
}
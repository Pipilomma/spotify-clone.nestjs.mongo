import { Injectable, Logger, ForbiddenException, BadRequestException, InternalServerErrorException, NotFoundException, ConflictException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from "mongoose";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { User, UserDocument } from "src/user/schemas/user.schema";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { InjectModel } from "@nestjs/mongoose";
import { throttleTime } from "rxjs";


@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService, 
                @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    generateJwtToken = (data: { email: string, role: string }) => {
        const payload = { email: data.email, role: data.role };
        return { access_token: this.jwtService.sign(payload) };
    };

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.getOneByCond({email: email, password: password});

        if (user && await bcrypt.compare(password, user.password_hash)) {
            const { password_hash, ...result } = user;
            return result;
        }

        console.log(await bcrypt.compare(user.password_hash, password))
        console.log(user)

        return null;
    }
    
    async login(user: User) {
        const { password_hash, ...result } = user;

        return {
            ...result,
            token: this.generateJwtToken({email: result.email, role: result.role}),
        };
    }

    async register(dto: CreateUserDto) {
        if (dto.password !== dto.passwordConfirm) {
            throw new BadRequestException("passwords don't match");
        }

        const u = await this.userModel.findOne({email: dto.email});
        if(u) {
            throw new ConflictException("this email already registrated");
        }

        const user = await this.userService.create({
            username: dto.username,
            email: dto.email,
            password: dto.password,
            passwordConfirm: dto.passwordConfirm,
            role: dto.role,
        });

        if (!user?._id) {
            throw new InternalServerErrorException('User creation failed');
        }

        const token = this.generateJwtToken({
            email: user.email,
            role: user.role,
        });

        return { id: user._id.toString(), username: user.username, email: user.email, token};
    }
}
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Types } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createDto: CreateUserDto): Promise<User> {
        if(createDto.password == undefined) {
            throw new BadRequestException("password is undefined");
        }

        if(createDto.password !== createDto.passwordConfirm) {
            throw new BadRequestException("passwords not match");
        }

        const passwordHash = await bcrypt.hash(createDto.password, 10);

        const user = await this.userModel.create({
            username: createDto.username,
            password_hash: passwordHash, 
            email: createDto.email,
            role: createDto.role,
        });

        return user;
    }

    async getOne(id: string): Promise<User> {
        const user = await this.userModel.findOne({_id: id});

        if(!user) {
            throw new NotFoundException("failed to find user");
        }

        return user;
    }

    async getAll(limit = 10, offset = 0): Promise<User[]> {
        const users = await this.userModel.find().skip(offset).limit(limit);

        return users;
    }

    async delete(id: Types.ObjectId): Promise<Types.ObjectId> {
        const user = await this.userModel.findOneAndDelete({_id: id});

        if(!user) {
            throw new NotFoundException("failed to delete user");
        }

        return user._id;
    }

    async getOneByCond(dto: LoginUserDto): Promise<User> {
        const user = await this.userModel.findOne({email: dto.email});

        if(!user) {
            throw new NotFoundException("failed to find user");
        }

        return user;
    }
}
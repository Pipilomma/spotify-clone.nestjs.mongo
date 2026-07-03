import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Types } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';
import { FileService } from "src/file/file.service";
import { FileToSaveType } from "../common/enums/fileType.enum"
import { UpdateUserDto } from "./dto/update-user.dto";


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
                private fileService: FileService) {}

    async create(createDto: CreateUserDto, avatar): Promise<User> {
        if(createDto.password == undefined) {
            throw new BadRequestException("password is undefined");
        }

        if(createDto.password !== createDto.passwordConfirm) {
            throw new BadRequestException("passwords not match");
        }

        const passwordHash = await bcrypt.hash(createDto.password, 10);
        const avatarPath = this.fileService.createFile(FileToSaveType.IMAGE, avatar);

        const user = await this.userModel.create({
            username: createDto.username,
            password_hash: passwordHash, 
            email: createDto.email,
            role: createDto.role,
            avatar: avatarPath,
        });

        return user;
    }

    async getById(id: string): Promise<User> {
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

    async uploadAvatar(userId: string, avatar) {
        const user = await this.userModel.findOne({_id: userId});

        if (!user) {
            throw new NotFoundException("user is not exists");
        }

        const avatarPath = this.fileService.createFile(FileToSaveType.IMAGE, avatar);
        user.avatar = avatarPath;
        
        return user.save();
    }

    async changeUsername(updateDto: UpdateUserDto, userId: string) {
        const user = await this.userModel.findOne({_id: userId});

        if (!user) {
            throw new NotFoundException("user is not exists");
        }

        user.username = updateDto.username;

        return user.save();
    }
}
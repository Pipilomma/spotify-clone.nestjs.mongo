import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { FileModule } from "src/file/file.module";

@Module({
    imports: [
            MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
            FileModule,
        ],
        
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {

}
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";
import { FileToSaveType } from "src/common/enums/fileType.enum";

@Injectable()
export class FileService {
    createFile(type: FileToSaveType, file): string {
        try {
            const fileExtension = file.originalname.split('.').pop()
            const fileName = uuid.v4() + '.' + fileExtension
            const filePath = path.resolve(__dirname, 'static', type)

            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }

            fs.writeFileSync(path.resolve(filePath, fileName), file.buffer)
            return type + '/' + fileName

        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'File write error';


            throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
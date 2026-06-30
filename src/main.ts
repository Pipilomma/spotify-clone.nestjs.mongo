import { NestFactory } from '@nestjs/core';
import { AppModule } from "./app.module"
import { Logger } from 'nestjs-pino';
import process from 'process';
import dotenv from 'dotenv';

dotenv.config();

const start = async () => {
    try {
        const app = await NestFactory.create(AppModule, { bufferLogs: true });
        app.useLogger(app.get(Logger));

        const port = process.env.PORT || 5050;

        app.enableCors();

        await app.listen(port, () => console.log("server was started"));
    } catch(e) {
        console.log(e);
    }
}

start();
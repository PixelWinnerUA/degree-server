import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./modules/app/app.module";
import * as process from "process";

async function start() {
    const app = await NestFactory.create(AppModule);
    const port = Number(process.env.SERVER_PORT) || 3000;

    app.setGlobalPrefix("/api");
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder().setTitle("Degree Project").setVersion("1.0.0").build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);

    await app.listen(port, () => console.log(`Server started successfully on port: ${port}`));
}

start();

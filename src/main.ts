import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./modules/app/app.module";
import * as process from "process";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ValidationPipe } from "./pipes/validation.pipe";

async function start() {
    const app = await NestFactory.create(AppModule);
    const port = Number(process.env.SERVER_PORT) || 3000;
    const corsOptions: CorsOptions = {
        origin: ["http://77.47.220.24:3000", "http://localhost:3000", "http://192.168.31.2:3000"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true
    };

    app.setGlobalPrefix("/api");
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors(corsOptions);

    const config = new DocumentBuilder().setTitle("Degree Project").setVersion("1.0.0").addBearerAuth().build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document, {
        swaggerOptions: {
            persistAuthorization: true
        }
    });

    await app.listen(port, () => console.log(`Server started successfully on port: ${port}`));
}

start();

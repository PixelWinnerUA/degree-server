import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "../users/users.module";
import { User } from "../users/models/users.model";
import { AuthModule } from "../auth/auth.module";
import { TokenModule } from "../token/token.module";
import * as process from "process";
import { StoragesModule } from "../storages/storages.module";
import { Storage } from "../storages/models/storages.model";
import { UserStorage } from "../storages/models/user-storage.model";
import { ShelvesModule } from "../shelves/shelves.module";
import { Shelf } from "../shelves/models/shelves.model";
import { Product } from "../products/models/products.model";

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: ".env" }),
        SequelizeModule.forRoot({
            dialect: "postgres",
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            models: [User, Storage, UserStorage, Shelf, Product],
            autoLoadModels: true,
            synchronize: true
        }),
        UsersModule,
        AuthModule,
        TokenModule,
        StoragesModule,
        ShelvesModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}

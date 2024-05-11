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
import { ProductsModule } from "../products/products.module";
import { SuppliersModule } from "../suppliers/suppliers.module";
import { Supplier } from "../suppliers/models/suppliers.model";
import { CacheModule } from "@nestjs/cache-manager";
import { MailerModule } from "@nestjs-modules/mailer";
import { SECONDS_IN_MINUTE } from "../../common/constants/common.constants";

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
            models: [User, Storage, UserStorage, Shelf, Product, Supplier],
            autoLoadModels: true,
            synchronize: true
        }),
        UsersModule,
        AuthModule,
        TokenModule,
        StoragesModule,
        ShelvesModule,
        ProductsModule,
        SuppliersModule,
        CacheModule.register({
            ttl: SECONDS_IN_MINUTE * 15,
            isGlobal: true
        }),
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                ignoreTLS: false,
                secure: process.env.MAIL_PORT === "465", //Google smtp port
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD
                }
            },
            defaults: {
                from: `"No Reply" ${process.env.MAIL_FROM}`
            }
        })
    ],
    controllers: [],
    providers: []
})
export class AppModule {
}

import { Module } from "@nestjs/common";
import { StoragesService } from "./storages.service";
import { StoragesController } from "./storages.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Storage } from "./models/storages.model";
import { UserStorage } from "./models/user-storage.model";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [SequelizeModule.forFeature([Storage, UserStorage]), UsersModule],
    controllers: [StoragesController],
    providers: [StoragesService],
    exports: [StoragesService]
})
export class StoragesModule {}

import { Module } from "@nestjs/common";
import { StoragesService } from "./storages.service";
import { StoragesController } from "./storages.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Storage } from "./models/storages.model";
import { UserStorage } from "./models/user-storage.model";

@Module({
    imports: [SequelizeModule.forFeature([Storage, UserStorage])],
    controllers: [StoragesController],
    providers: [StoragesService]
})
export class StoragesModule {}

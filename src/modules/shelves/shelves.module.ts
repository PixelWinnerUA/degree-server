import { Module } from "@nestjs/common";
import { ShelvesService } from "./shelves.service";
import { ShelvesController } from "./shelves.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Storage } from "../storages/models/storages.model";
import { Shelf } from "./models/shelves.model";
import { StoragesModule } from "../storages/storages.module";
import { StoragesGuard } from "../../guards/storages.guard";

@Module({
    imports: [SequelizeModule.forFeature([Shelf, Storage]), StoragesModule],
    controllers: [ShelvesController],
    providers: [ShelvesService, StoragesGuard],
    exports: [ShelvesService]
})
export class ShelvesModule {}

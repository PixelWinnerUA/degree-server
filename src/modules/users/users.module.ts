import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./models/users.model";
import { UsersController } from "./users.controller";
import { UserStorage } from "../storages/models/user-storage.model";

@Module({
    imports: [SequelizeModule.forFeature([User, UserStorage])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}

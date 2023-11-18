import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { UserStorage } from "../../storages/models/user-storage.model";
import { Storage } from "../../storages/models/storages.model";

interface UserCreationAttrs {
    name: string;
    email: string;
    password: string;
}

@Table({ tableName: "users" })
@BelongsToMany(() => Storage, () => UserStorage)
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: "Alex" })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @ApiProperty({ example: "email@example.com" })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @ApiProperty({ example: "password" })
    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @BelongsToMany(() => Storage, () => UserStorage)
    storages: Storage[];

    @HasMany(() => UserStorage)
    userStorages: UserStorage[];
}

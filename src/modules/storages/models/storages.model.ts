import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { UserStorage } from "./user-storage.model";
import { User } from "../../users/models/users.model";
import { Shelf } from "../../shelves/models/shelves.model";

interface StorageCreationAttrs {
    name: string;
    address: string;
    ownerId: number;
}

@Table({ tableName: "storage" })
@BelongsToMany(() => User, () => UserStorage)
export class Storage extends Model<Storage, StorageCreationAttrs> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: "Storage 1" })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @ApiProperty({ example: "Address string" })
    @Column({ type: DataType.STRING, allowNull: false })
    address: string;

    @Column({ type: DataType.INTEGER })
    ownerId: number;

    @BelongsToMany(() => User, () => UserStorage)
    users: User[];

    @HasMany(() => Shelf)
    shelves: Shelf[];
}

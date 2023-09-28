import { Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

interface StorageCreationAttrs {
    name: string;
}

@Table({ tableName: "storage" })
export class Storage extends Model<Storage, StorageCreationAttrs> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: "Storage 1" })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;
}

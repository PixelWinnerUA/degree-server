import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Storage } from "../../storages/models/storages.model";
import { Product } from "../../products/models/products.model";

interface ShelfCreationAttrs {
    storageId: number;
    name: string;
}

@Table({ tableName: "shelf" })
export class Shelf extends Model<Shelf, ShelfCreationAttrs> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: "Storage 1" })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @ForeignKey(() => Storage)
    @Column({ type: DataType.INTEGER, allowNull: false })
    storageId: number;

    @BelongsTo(() => Storage)
    storage: Storage;

    @HasMany(() => Product)
    products: Product[];
}

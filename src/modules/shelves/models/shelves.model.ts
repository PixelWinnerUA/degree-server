import { BeforeCreate, BeforeUpdate, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Storage } from "../../storages/models/storages.model";
import { Product } from "../../products/models/products.model";
import { ShelfHooks } from "../hooks";

interface ShelfCreationAttrs {
    storageId: number;
    name: string;
    length: number;
    width: number;
    height: number;
    maxWeight: number;
}

@Table({ tableName: "shelf" })
export class Shelf extends Model<Shelf, ShelfCreationAttrs> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: "Shelf 1" })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @ForeignKey(() => Storage)
    @Column({ type: DataType.INTEGER, allowNull: false })
    storageId: number;

    @ApiProperty({ example: "1.1" })
    @Column({ type: DataType.DOUBLE, allowNull: false })
    length: number;

    @ApiProperty({ example: "1.1" })
    @Column({ type: DataType.DOUBLE, allowNull: false })
    width: number;

    @ApiProperty({ example: "1.1" })
    @Column({ type: DataType.DOUBLE, allowNull: false })
    height: number;

    @ApiProperty({ example: "10" })
    @Column({ type: DataType.DOUBLE, allowNull: false })
    maxWeight: number;

    @ApiProperty({ example: "50" })
    @Column({ type: DataType.DOUBLE })
    availableWeight: number;

    @ApiProperty({ example: "100" })
    @Column({ type: DataType.DOUBLE })
    maxVolume: number;

    @ApiProperty({ example: "50" })
    @Column({ type: DataType.DOUBLE })
    availableVolume: number;

    @BelongsTo(() => Storage)
    storage: Storage;

    @HasMany(() => Product)
    products: Product[];

    @BeforeCreate
    static async beforeCreateHook(instance: Shelf): Promise<void> {
        await ShelfHooks.beforeCreate(instance);
    }

    @BeforeUpdate
    static async beforeUpdateHook(instance: Shelf): Promise<void> {
        await ShelfHooks.beforeUpdate(instance);
    }
}

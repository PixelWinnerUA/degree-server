import { AfterDestroy, BeforeCreate, BeforeUpdate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Shelf } from "../../shelves/models/shelves.model";
import { ApiProperty } from "@nestjs/swagger";
import { ProductHooks } from "../hooks";
import { ArchiveRecord, DynamicField } from "../dto";
import { Supplier } from "../../suppliers/models/suppliers.model";

interface ProductCreationAttrs {
    shelfId: number;
    name: string;
    amount: number;
    pricePerUnit: number;
    weightPerUnit: number;
    length: number;
    width: number;
    height: number;
    properties: DynamicField[];
    supplierId: number;
}

@Table({ tableName: "product" })
export class Product extends Model<Product, ProductCreationAttrs> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @ApiProperty({ example: "Product №1" })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @ApiProperty({ example: "13" })
    @Column({ type: DataType.INTEGER, allowNull: false })
    amount: number;

    @ApiProperty({ example: "10" })
    @Column({ type: DataType.DOUBLE, allowNull: false })
    pricePerUnit: number;

    @ApiProperty({ example: "1" })
    @Column({ type: DataType.DOUBLE, allowNull: false })
    weightPerUnit: number;

    @ApiProperty({ example: "1.1" })
    @Column({ type: DataType.DOUBLE, allowNull: false })
    length: number;

    @ApiProperty({ example: "1.1" })
    @Column({ type: DataType.DOUBLE, allowNull: false })
    width: number;

    @ApiProperty({ example: "1.1" })
    @Column({ type: DataType.DOUBLE, allowNull: false })
    height: number;

    @ApiProperty({ example: [{ label: "Label", value: "Value" }] })
    @Column({ type: DataType.JSONB, allowNull: true })
    properties: DynamicField[];

    @ApiProperty({ example: 2 })
    @ForeignKey(() => Shelf)
    @Column({ type: DataType.INTEGER, allowNull: false })
    shelfId: number;

    @BelongsTo(() => Shelf)
    shelf: Shelf;

    @ApiProperty({ example: 1 })
    @ForeignKey(() => Supplier)
    @Column({ type: DataType.INTEGER, allowNull: false })
    supplierId: number;

    @BelongsTo(() => Supplier)
    supplier: Supplier;

    @ApiProperty({ example: [{ reason: "Reason", amount: 10, date: new Date() }] })
    @Column({ type: DataType.JSONB, allowNull: true })
    archiveRecords: ArchiveRecord[];

    @ApiProperty({ example: "13" })
    @Column({ type: DataType.INTEGER, allowNull: false })
    initialAmount: number;

    @BeforeCreate
    static async beforeCreateHook(instance: Product): Promise<void> {
        await ProductHooks.beforeCreate(instance);
    }

    @BeforeUpdate
    static async beforeUpdateHook(instance: Product): Promise<void> {
        await ProductHooks.beforeUpdate(instance);
    }

    @AfterDestroy
    static async afterDestroyHook(instance: Product): Promise<void> {
        await ProductHooks.afterDestroy(instance);
    }
}

import { Column, DataType, BelongsToMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../../products/models/products.model";
import { ShipmentProducts } from "./shipment-products.model";

interface ShipmentCreationAttrs {
    name: string;
    surname: string;
    patronymic: string;
    address: string;
    email: string;
    phoneNumber: string;
}

@Table({ tableName: "shipment" })
export class Shipment extends Model<Shipment, ShipmentCreationAttrs> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: "Name" })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @ApiProperty({ example: "Surname" })
    @Column({ type: DataType.STRING, allowNull: false })
    surname: string;

    @ApiProperty({ example: "Patronymic" })
    @Column({ type: DataType.STRING, allowNull: false })
    patronymic: string;

    @ApiProperty({ example: "Address 1" })
    @Column({ type: DataType.STRING, allowNull: false })
    address: string;

    @ApiProperty({ example: "email@example.com" })
    @Column({ type: DataType.STRING, allowNull: false })
    email: string;

    @ApiProperty({ example: "+380990000000" })
    @Column({ type: DataType.STRING, allowNull: false })
    phoneNumber: string;

    @BelongsToMany(() => Product, () => ShipmentProducts)
    products: Product[];
}

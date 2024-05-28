import { Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

interface SupplierCreationAttrs {
    TIN: string;
    USREOU: string;
    email: string;
    fullCompanyName: string;
    legalAddress: string;
    phoneNumber: string;
}

@Table({ tableName: "supplier" })
export class Supplier extends Model<Supplier, SupplierCreationAttrs> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: "TIN" })
    @Column({ type: DataType.STRING, allowNull: false })
    TIN: string;

    @ApiProperty({ example: "USREOU" })
    @Column({ type: DataType.STRING, allowNull: false })
    USREOU: string;

    @ApiProperty({ example: "email@example.com" })
    @Column({ type: DataType.STRING, allowNull: false })
    email: string;

    @ApiProperty({ example: "Company name" })
    @Column({ type: DataType.STRING, allowNull: false })
    fullCompanyName: string;

    @ApiProperty({ example: "Legal address" })
    @Column({ type: DataType.STRING, allowNull: false })
    legalAddress: string;

    @ApiProperty({ example: "+380990000000" })
    @Column({ type: DataType.STRING, allowNull: false })
    phoneNumber: string;
}

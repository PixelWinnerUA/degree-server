import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";

export class CreateShelfDto {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    storageId: number;

    @ApiProperty({ example: "Shelf 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    name: string;
}

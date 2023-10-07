import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";

export class GetStoragesResponse {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;

    @ApiProperty({ example: "Storage 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    name: string;
}

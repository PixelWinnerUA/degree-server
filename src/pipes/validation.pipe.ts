import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { capitalize } from "lodash";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
        const obj = plainToInstance(metadata.metatype, value);
        const errors = await validate(obj);

        if (errors.length) {
            const messages = errors.map((err) => {
                return `${capitalize(err.property)} - ${Object.values(err.constraints).join(", ")}`;
            });
            throw new BadRequestException(messages);
        }
        return value;
    }
}

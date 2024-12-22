import { PartialType } from "@nestjs/mapped-types";
import { CreateTripDto } from "./createTrip.dto";

export class UpdateTripDto extends PartialType(CreateTripDto) {}
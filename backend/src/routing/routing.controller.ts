import {Controller, Get, Param, Query} from "@nestjs/common";
import {RoutingDto} from "./dto/routing,dto";
import {RoutingService} from "./routing.service";

@Controller('routing')
export class RoutingController {
    constructor(private readonly routingService: RoutingService) {}

    @Get()
    getRoute(@Query() {from, to, bikeType}: RoutingDto) {
        if (!from || !to || !bikeType) {
            throw new Error('Missing parameters');
        }
        return this.routingService.getRoute(from, to, bikeType);
    }
}
import {Controller, Get, Param, Query} from "@nestjs/common";
import {RoutingDto} from "./dto/routing,dto";

@Controller('routing')
export class RoutingController {
    private routingService: any;
    constructor() {}

    @Get()
    getRoute(@Query() {from, to, bikeType}: RoutingDto) {
        return this.routingService.getRoute(from, to, bikeType);
    }
}
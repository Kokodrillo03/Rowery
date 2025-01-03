import {Controller, Get, Param} from "@nestjs/common";

@Controller('routing')
export class RoutingController {
    private routingService: any;
    constructor() {}

    @Get()
    getRoute(@Param() from: string, @Param() to: string, @Param() bikeType: string) {
        return this.routingService.getRoute(from, to, bikeType);
    }
}
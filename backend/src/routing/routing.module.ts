import {Module} from "@nestjs/common";
import {RoutingService} from "./routing.service";
import {RoutingController} from "./routing.controller";

@Module({
    imports: [],
    providers: [RoutingService],
    controllers: [RoutingController],
})
export class RoutingModule {}
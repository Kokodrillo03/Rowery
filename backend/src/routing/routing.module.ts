import {Module} from "@nestjs/common";
import {RoutingService} from "./routing.service";
import {RoutingController} from "./routing.controller";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [RoutingService],
    controllers: [RoutingController],
})
export class RoutingModule {}
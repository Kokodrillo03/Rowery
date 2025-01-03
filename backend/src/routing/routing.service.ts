import {Injectable} from "@nestjs/common";

@Injectable
export class RoutingService {
    constructor() {}

    getRoute(from: string, to: string, bikeType: string) {
        return `Route from ${from} to ${to} for ${bikeType} bike`;
    }
}

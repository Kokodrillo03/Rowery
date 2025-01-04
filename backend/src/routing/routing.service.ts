import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";

@Injectable()
export class RoutingService {
    constructor(
        private readonly httpService: HttpService,
    ) {}



    async getRoute(from: string, to: string, bikeType: string) {
        const bikeTypeGraphHopperTypeMap = {
            'trekking': 'bike',
            'road': 'racingbike',
            'mountain': 'mtb',
        }
        const baseUrl = process.env.GRAPH_HOPPER_API_URL;
        const apiKey = process.env.GRAPH_HOPPER_API_KEY;
        const graphHopperBikeType = bikeTypeGraphHopperTypeMap[bikeType];
        const response = await firstValueFrom(this.httpService.get(`${baseUrl}/route?point=${from}&point=${to}&vehicle=${graphHopperBikeType}&key=${apiKey}`).pipe());
        console.log(response)
        return response.data;
    }
}

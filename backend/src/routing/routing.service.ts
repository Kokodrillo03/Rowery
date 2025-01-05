import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";

@Injectable()
export class RoutingService {
    constructor(
        private readonly httpService: HttpService,
    ) {}



    async getRoute(waypoints: string[], bikeType: string) {
        const bikeTypeGraphHopperTypeMap = {
            'Trekkingowy': 'bike',
            'Szosowy': 'racingbike',
            'Gorski': 'mtb',
        }
        const baseUrl = process.env.GRAPH_HOPPER_API_URL;
        const apiKey = process.env.GRAPH_HOPPER_API_KEY;
        const graphHopperBikeType = bikeTypeGraphHopperTypeMap[bikeType];
        try {
            const url = `${baseUrl}/route?point=${waypoints.join('&point=')}&vehicle=${graphHopperBikeType}&points_encoded=false&key=${apiKey}`;
            const response = await firstValueFrom(this.httpService.get(url).pipe());
            console.log(response)
            const path = response.data.paths[0];
            return {
                points: path.points,
            }
        } catch (e) {
            console.log(e);
            throw new Error('Error while fetching route');
        }
    }
}

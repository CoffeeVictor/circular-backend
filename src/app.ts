import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import { Location } from '.prisma/client';
import axios from 'axios';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

interface IGoogleLocation {
	location: {
		lat: number;
		lng: number;
	};
	accuracy: number;
}

interface IWifiAccessPoint {
	macAddress: String;
	signalStrength: number;
	channel: number;
}

interface IWifiRequestBody {
	wifiAccessPoints: IWifiAccessPoint[];
}

app.get('/location', async (req: Request, res: Response) => {
	const locations = await prisma.location.findMany({
		orderBy: {
			created_at: 'desc',
		},
	});

	return res.json(locations);
});

app.get(
	'/location/latest',
	async (req: Request<any, any, Location>, res: Response<Location | null>) => {
		const location = await prisma.location.findFirst({
			orderBy: {
				created_at: 'desc',
			},
		});

		return res.json(location);
	}
);

app.post(
	'/location',
	async (req: Request<any, any, Location>, res: Response<Location>) => {
		const { latitude, longitude } = req.body;

		const data = await prisma.location.create({
			data: {
				latitude,
				longitude,
			},
		});

		return res.json(data);
	}
);

app.post(
	'/wifi',
	async (req: Request<any, any, IWifiRequestBody>, res: Response) => {
		const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GOOGLE_GEO_API_KEY}`;

		const data = req.body;

		const { data: result }: { data: IGoogleLocation } = await axios.post(
			url,
			data
		);

		const { lat: latitude, lng: longitude } = result.location;
		const { accuracy } = result;

		const location = await prisma.location.create({
			data: {
				latitude,
				longitude,
				accuracy,
				origin: 'WIFI',
			},
		});

		return res.json(location);
	}
);

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log('Server listening on port:', port);
});

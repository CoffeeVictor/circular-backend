import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import { Location } from '.prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

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

app.listen(8000, () => {
	console.log('Server listening on port:', 8000);
});

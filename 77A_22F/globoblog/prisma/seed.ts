import { PrismaClient } from "@prisma/client";
import {mockData} from './mock-data'

const prisma = new PrismaClient()

const LoadMockup = async () => {
	try {

		await prisma.$transaction([
			prisma.post.deleteMany(),
			prisma.post.createMany({
				data: mockData.map(el => {
					return {
						address: el.address,
						city: el.city,
						content: el.content,
						object: el.object,
						createdById: el.userId,
						latitude: el.latitude,
						longitude: el.longitude,
					}
				})
			})
		])

	} catch (e) {
		console.error(e)
		await prisma.$disconnect();
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}
LoadMockup();
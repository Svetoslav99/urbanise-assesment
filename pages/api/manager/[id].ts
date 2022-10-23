import type { NextApiRequest, NextApiResponse } from 'next';
import { Manager, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Response = {
    message: string;
    error: boolean;
    data: Manager | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if (req.method === 'GET') {
        try {
            const data = req.query;

            if (!data.id) {
                throw new Error('Parameter "id" is mandatory request query parameter!');
            }

            await prisma.$connect();
            const managerExists = await prisma.manager.findUnique({
                where: {
                    id: data.id as string
                }
            });

            await prisma.$disconnect();

            if (!managerExists) {
                return res.status(404).json({
                    message: `Manager with such id "${data.id}" does not exist.`,
                    error: true,
                    data: null
                });
            }

            return res.status(201).json({
                message: `Successfully retrieved manager with id "${data.id}" from the database!`,
                error: false,
                data: managerExists
            });
        } catch (error) {
            await prisma.$disconnect();

            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({
                message: `An error occured: ${message}`,
                error: true,
                data: null
            });
        }
    }

    return res.status(400).json({
        message: 'Request method not supported!',
        error: true,
        data: null
    });
}

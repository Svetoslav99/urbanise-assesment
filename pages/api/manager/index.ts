import type { NextApiRequest, NextApiResponse } from 'next';
import { Manager, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Response = {
    message: string;
    error: boolean;
    data: Manager[] | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {

    if (req.method === 'GET') {
        try {
            await prisma.$connect();
            const retrievedManagers = await prisma.manager.findMany();
            await prisma.$disconnect();

            if (!retrievedManagers || retrievedManagers.length === 0) {
                return res.status(404).json({
                    message: `There are no managers in the database yet!`,
                    error: true,
                    data: null
                });
            }

            return res.status(201).json({
                message: 'Successfully retrieved managers from the database!',
                error: false,
                data: retrievedManagers
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

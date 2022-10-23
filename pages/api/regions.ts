import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Region from '../../types/region';

const prisma = new PrismaClient();

type Response = {
    message: string;
    error: boolean;
    data: Region[] | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if (req.method === 'GET') {
        try {
            await prisma.$connect();

            const regions = await prisma.region.findMany();

            await prisma.$disconnect();

            if (!regions || regions.length === 0) {
                return res.status(404).json({
                    message: `Regions collection is empty.`,
                    error: true,
                    data: null
                });
            }

            return res.status(201).json({
                message: `Successfully retrieved regions collection from the database!`,
                error: false,
                data: regions
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

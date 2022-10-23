import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Response = {
    message: string;
    error: boolean;
};

type RequestBody = {
    viewPropertyId: string;
    detailedPropertyId: string;
    deleting: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if (req.method === 'POST') {
        const data: RequestBody = req.body;

        if (data.deleting) {
            try {
                await prisma.$connect();

                const deleteDetailedProperty = await prisma.detailedProperty.delete({
                    where: {
                        id: data.detailedPropertyId
                    }
                });

                const deleteViewProperty = await prisma.viewProperty.delete({
                    where: {
                        id: data.viewPropertyId
                    }
                });

                return res.status(201).json({
                    message: `Successfully removed property from the database!`,
                    error: false
                });
            } catch (error) {
                await prisma.$disconnect();

                const message = error instanceof Error ? error.message : String(error);
                return res.status(500).json({
                    message: `An error occured: ${message}`,
                    error: true
                });
            }
        }
    }

    return res.status(400).json({
        message: 'Request method not supported!',
        error: true
    });
}

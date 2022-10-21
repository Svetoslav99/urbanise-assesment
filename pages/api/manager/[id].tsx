import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Manager from '../../../types/manager';

const prisma = new PrismaClient();

type Response = {
    message: string;
    error: boolean;
    data: Manager | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    /**
 * GET /api/manager/{id} returns:
{
    id: {id},
    firstName: “John”,
    lastName: “Smith”,
    managedSince: “2020-12-12”,
}
 * 
 */

    /**
 * 
 * For example, the API route pages/api/post/[pid].js has the following code:

    export default function handler(req, res) {
        const { pid } = req.query
        res.end(`Post: ${pid}`)
    }
 * 
 */

    if (req.method === 'GET') {
        try {
            const { id } = req.query;

            if (!id) {
                throw new Error('Parameter "id" is mandatory request query parameter!');
            }

            await prisma.$connect();
            const managerExists = await prisma.manager.findUnique({
                where: {
                    id: id
                }
            });

            await prisma.$disconnect();

            if (!managerExists) {
                return res.status(404).json({
                    message: `Manager with such id "${id}" does not exist.`,
                    error: true,
                    data: null
                });
            }

            return res.status(201).json({
                message: `Successfully retrieved manager with id "${id}" from the database!`,
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

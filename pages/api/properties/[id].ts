// /**
//  GET/PUT/DELETE /api/properties/{id}:
// {
//     id: 0,
//     name: “name”,
//     plan: “plan number”,
//     units: [{
//     id: 0,
//     lotAlpha: “1”,
//     floor: 0,
//     type: “Residential”,
//     }],
//     city: “Sofia”,
//     region: 0,
//     manager: 0,
//     previousManager: 0,
//     managementCompany: “Some Company”,
//     planRegistered: “2020-12-12”,
//     address: “address”,
//     account: “acc”,
//     abn: “ABN”,
// }
//  *
//  */

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
        console.log('data: ', data);

        if (data.deleting) {
            try {
                await prisma.$connect();

                await prisma.viewProperty.delete({
                    where: {
                        id: data.viewPropertyId
                    }
                });

                await prisma.detailedProperty.delete({
                    where: {
                        id: data.detailedPropertyId
                    }
                });

                return res.status(201).json({
                    message: `Successfully removed property from the database!`,
                    error: false
                });
            } catch (error) {
                console.log('error: ', error);

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

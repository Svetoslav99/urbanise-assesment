import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { ViewProperty } from '../../../types/property';

const prisma = new PrismaClient();

type Response = {
    message: string;
    error: boolean;
    data: ViewProperty[] | null;
};

type RequestBody = {
    name: string;
    planNumber: number;
    region: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if (req.method === 'POST') {
        try {
            const data: RequestBody = req.body;

            await prisma.$connect();

            const retrievedPropertiesArr: ViewProperty[] = [];

            if (!data.name && (data.planNumber === 0 || !data.planNumber) && !data.region) {
                const retrievedProperties = await prisma.viewProperty.findMany();
                retrievedPropertiesArr.push(...retrievedProperties);
            }

            if (data.name && data.planNumber && data.region) {
                const retrievedProperties = await prisma.viewProperty.findMany({
                    where: {
                        AND: {
                            name: { equals: data.name },
                            plan: { equals: data.planNumber },
                            region: { equals: data.region }
                        }
                    }
                });

                retrievedPropertiesArr.push(...retrievedProperties);
            } else if (data.name && data.planNumber && !data.region) {
                const retrievedProperties = await prisma.viewProperty.findMany({
                    where: {
                        AND: {
                            name: { equals: data.name },
                            plan: { equals: data.planNumber }
                        }
                    }
                });

                retrievedPropertiesArr.push(...retrievedProperties);
            } else if (data.name && !data.planNumber && data.region) {
                const retrievedProperties = await prisma.viewProperty.findMany({
                    where: {
                        AND: {
                            name: { equals: data.name },
                            region: { equals: data.region }
                        }
                    }
                });

                retrievedPropertiesArr.push(...retrievedProperties);
            } else if (!data.name && data.planNumber && data.region) {
                const retrievedProperties = await prisma.viewProperty.findMany({
                    where: {
                        AND: {
                            plan: { equals: data.planNumber },
                            region: { equals: data.region }
                        }
                    }
                });

                retrievedPropertiesArr.push(...retrievedProperties);
            } else if (data.name && !data.planNumber && !data.region) {
                const retrievedProperties = await prisma.viewProperty.findMany({
                    where: {
                        name: data.name
                    }
                });

                retrievedPropertiesArr.push(...retrievedProperties);
            } else if (!data.name && data.planNumber && !data.region) {
                const retrievedProperties = await prisma.viewProperty.findMany({
                    where: {
                        plan: data.planNumber
                    }
                });

                retrievedPropertiesArr.push(...retrievedProperties);
            } else if (!data.name && !data.planNumber && data.region) {
                const retrievedProperties = await prisma.viewProperty.findMany({
                    where: {
                        region: data.region
                    }
                });

                retrievedPropertiesArr.push(...retrievedProperties);
            }

            await prisma.$disconnect();

            if (retrievedPropertiesArr.length === 0) {
                return res.status(404).json({
                    message: `No results found for the currently applied filter.`,
                    error: false,
                    data: null
                });
            }

            return res.status(201).json({
                message: `Successfully retrieved properties from the database!`,
                error: false,
                data: retrievedPropertiesArr
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

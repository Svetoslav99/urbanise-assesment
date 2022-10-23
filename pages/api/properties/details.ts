import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import date from 'date-and-time';

import { DetailedProperty } from '../../../types/property';
import Unit from '../../../types/unit';

const prisma = new PrismaClient();

type Response = {
    message: string;
    error: boolean;
    data: DetailedProperty | null;
};

type RequestBody = {
    planNumber: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if (req.method === 'POST') {
        try {
            const data: RequestBody = req.body;

            await prisma.$connect();

            const retrievedDetailedProperty = await prisma.detailedProperty.findUnique({
                where: {
                    plan: +data.planNumber
                }
            });

            if (!retrievedDetailedProperty) {
                throw new Error('There are no property details for a property with this plan number!');
            }

            const retrievedDetailedUnits: Unit[] = [];
            for (const unitId of retrievedDetailedProperty.units) {
                const retrievedUnit = await prisma.unit.findUnique({
                    where: {
                        id: unitId
                    }
                });

                if (!retrievedUnit) {
                    throw new Error(
                        'There is no info about unit in our database for property details with this plan number!'
                    );
                }

                retrievedDetailedUnits.push(retrievedUnit);
            }

            const retrievedRegion = await prisma.region.findUnique({
                where: {
                    id: retrievedDetailedProperty.regionId
                }
            });

            if (!retrievedRegion) {
                throw new Error(
                    'There is no info about region in our database for property details with this plan number!'
                );
            }

            const retrievedManager = await prisma.manager.findUnique({
                where: {
                    id: retrievedDetailedProperty.managerId
                }
            });

            if (!retrievedManager) {
                throw new Error(
                    'There is no info about manager in our database for property details with this plan number!'
                );
            }

            const retrievedPreviousManager = await prisma.manager.findUnique({
                where: {
                    id: retrievedDetailedProperty.previousManagerId
                }
            });

            if (!retrievedPreviousManager) {
                throw new Error(
                    'There is no info about previous manager in our database for property details with this plan number!'
                );
            }

            const retrievedManagerFormatted = {
                ...retrievedManager,
                managedSince: date.format(retrievedManager.managedSince, 'YYYY-MM-DD')
            };
            const retrievedPrevManagerFormatted = {
                ...retrievedPreviousManager,
                managedSince: date.format(retrievedPreviousManager.managedSince, 'YYYY-MM-DD')
            };

            const planRegisteredFormatted = date.format(retrievedDetailedProperty.planRegistered, 'YYYY-MM-DD');

            const dataObj: DetailedProperty = {
                id: retrievedDetailedProperty.id,
                name: retrievedDetailedProperty.name,
                plan: retrievedDetailedProperty.plan,
                units: retrievedDetailedUnits,
                city: retrievedDetailedProperty.city,
                region: retrievedRegion,
                manager: retrievedManagerFormatted,
                previousManager: retrievedPrevManagerFormatted,
                managementCompany: retrievedDetailedProperty.managementCompany,
                planRegistered: planRegisteredFormatted,
                address: retrievedDetailedProperty.address,
                account: retrievedDetailedProperty.account,
                abn: retrievedDetailedProperty.abn
            };

            return res.status(201).json({
                message: `Successfully retrieved properties from the database!`,
                error: false,
                data: dataObj
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

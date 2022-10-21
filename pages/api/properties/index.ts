// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { DetailedProperty, ViewProperty } from '../../../types/property';
import Unit from '../../../types/unit';

const prisma = new PrismaClient();

type ResponsePost = {
    message: string;
    error: boolean;
};

type ResponseGet = {
    message: string;
    error: boolean;
    data: ViewProperty[] | null;
};

function formatDate(dateString: String) {
    const [year, month, day] = dateString.split('-');
    const formattedDate = new Date(+year, +month, +day).toISOString();
    return formattedDate;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponsePost | ResponseGet>) {
    /**
 POST /api/properties/ return:
{
    id: 0,
    name: “name”,
    plan: “plan number”,
    units: [{
    id: 0,
    lotAlpha: “1”,
    floor: 0,
    type: “Residential”,
    }],
    city: “Sofia”,
    region: 0,
    manager: 0,
    previousManager: 0,
    managementCompany: “Some Company”,
    planRegistered: “2020-12-12”,
    address: “address”,
    account: “acc”,
    abn: “ABN”,
}

GET /api/properties/ returns:
[{
    id: 0,
    name: “name”,
    plan: “plan number”,
    units: 0,
    city: “Sofia”,
    region: 0,
    manager: 0,
}]

 * 
 */

    if (req.method === 'GET') {
        try {
            await prisma.$connect();
            const retrievedDetailedProperties = await prisma.viewProperty.findMany();

            if (!retrievedDetailedProperties || retrievedDetailedProperties.length === 0) {
                throw new Error(
                    'There are no properties in the database! Please go to "create property" page and create some!'
                );
            }

            return res.status(201).json({
                message: `Successfully retrieved properties!`,
                error: false,
                data: retrievedDetailedProperties
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
    } else if (req.method === 'POST') {
        /**
         *  POST /api/properties/ return:
            {
                id: 0,
                name: “name”,
                plan: “plan number”,
                units: [{
                id: 0,
                lotAlpha: “1”,
                floor: 0,
                type: “Residential”,
                }],
                city: “Sofia”,
                region: 0,
                manager: 0,
                previousManager: 0,
                managementCompany: “Some Company”,
                planRegistered: “2020-12-12”,
                address: “address”,
                account: “acc”,
                abn: “ABN”,
            }
         * 
         */
        try {
            const data: DetailedProperty = req.body;

            await prisma.$connect();

            // first - create the manager, the region
            const retrievedUnitsId: string[] = [];
            for (const unit of data.units) {
                let retrievedUnit: Unit | null = await prisma.unit.findUnique({
                    where: {
                        lotAlpha_floor_type: { lotAlpha: unit.lotAlpha, floor: unit.floor, type: unit.type }
                    }
                });

                if (!retrievedUnit) {
                    retrievedUnit = await prisma.unit.create({
                        data: {
                            lotAlpha: unit.lotAlpha,
                            floor: unit.floor,
                            type: unit.type
                        }
                    });

                }
                retrievedUnitsId.push(retrievedUnit.id as string);
            }

            let formattedDate = formatDate(data.manager.managedSince);

            const managerData = {
                firstName: data.manager.firstName,
                lastName: data.manager.lastName,
                managedSince: formattedDate
            };

            let retrievedManager = await prisma.manager.findUnique({
                where: {
                    firstName_lastName_managedSince: managerData
                }
            });

            if (!retrievedManager) {
                retrievedManager = await prisma.manager.create({
                    data: managerData
                });

            }

            formattedDate = formatDate(data.previousManager.managedSince);

            const prevManagerData = {
                firstName: data.previousManager.firstName,
                lastName: data.previousManager.lastName,
                managedSince: formattedDate
            };

            let retrievedPrevManager = await prisma.manager.findUnique({
                where: {
                    firstName_lastName_managedSince: prevManagerData
                }
            });

            if (!retrievedPrevManager) {
                retrievedPrevManager = await prisma.manager.create({
                    data: prevManagerData
                });

            }

            let retrievedRegion = await prisma.region.findUnique({
                where: { name: data.region.name }
            });


            if (!retrievedRegion) {
                retrievedRegion = await prisma.region.create({
                    data: { name: data.region.name }
                });

            }

            formattedDate = formatDate(data.planRegistered);

            const createdDetailedProperty = await prisma.detailedProperty.create({
                data: {
                    name: data.name,
                    plan: +data.plan,
                    units: retrievedUnitsId,
                    city: data.city,
                    regionId: retrievedRegion.id,
                    managerId: retrievedManager.id,
                    previousManagerId: retrievedPrevManager.id,
                    managementCompany: data.managementCompany,
                    planRegistered: formattedDate,
                    address: data.address,
                    account: data.account,
                    abn: data.abn.toUpperCase()
                }
            });

            const createdViewProperty = await prisma.viewProperty.create({
                data: {
                    name: data.name,
                    plan: +data.plan,
                    unitCount: retrievedUnitsId.length,
                    city: data.city,
                    region: data.region.name,
                    manager: data.manager.firstName + ' ' + data.manager.lastName,
                    managedSince: data.manager.managedSince,
                    detailedPropertyId: createdDetailedProperty.id
                }
            });

            return res.status(201).json({
                message: `Successfully created a new property!`,
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
    return res.status(400).json({
        message: 'Request method not supported!',
        error: true,
        data: null
    });
}

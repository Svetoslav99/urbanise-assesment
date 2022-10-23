// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { DetailedProperty, ViewProperty } from '../../../types/property';
import Unit from '../../../types/unit';
import { formatDate } from '../../../utils/formatDate';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponsePost | ResponseGet>) {
    if (req.method === 'POST') {
        try {
            const data: DetailedProperty = req.body;
            await prisma.$connect();

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

            let formattedDate = await formatDate(data.manager.managedSince);

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

            formattedDate = await formatDate(data.previousManager.managedSince);

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

            formattedDate = await formatDate(data.planRegistered);

            const createddata = await prisma.detailedProperty.update({
                where: {
                    id: data.id
                },
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

            const createdViewProperty = await prisma.viewProperty.update({
                where: {
                    detailedPropertyId: data.id
                },
                data: {
                    name: data.name,
                    plan: +data.plan,
                    unitCount: retrievedUnitsId.length,
                    city: data.city,
                    region: data.region.name,
                    manager: data.manager.firstName + ' ' + data.manager.lastName,
                    managedSince: data.manager.managedSince,
                    detailedPropertyId: createddata.id
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

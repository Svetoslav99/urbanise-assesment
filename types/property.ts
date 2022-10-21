import Unit from './unit';
import Region from './region';
import Manager from './manager';

export type DetailedProperty = {
    id: string;
    name: string;
    plan: number;
    units: Unit[];
    city: string;
    region: Region;
    manager: Manager;
    previousManager: Manager;
    managementCompany: string;
    planRegistered: string;
    address: string;
    account: string;
    abn: string;
};

export type ViewProperty = {
    id: string;
    name: string;
    plan: number;
    unitCount: number;
    city: string;
    region: string;
    manager: string;
    managedSince: string;
    detailedPropertyId: string;
};

import React, { useState, useRef } from 'react';
import cn from 'classnames';

import { DetailedProperty } from '../../../types/property';
import { Button } from '../..';
import classes from './detailsProperty.module.scss';
import Unit from '../../../types/unit';

type Response = {
    error: boolean;
    message: string;
    data: DetailedProperty | null;
};

const DetailsProperty: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [detailedProperty, setDetailedPropery] = useState<DetailedProperty>();
    const planNumberRef = useRef<HTMLInputElement>(null);

    const retrievePropertyDetailsHandler = async (e: React.MouseEvent) => {
        const planNumber = planNumberRef.current!.value;

        try {
            setIsLoading(true);

            const res = await fetch('/api/properties/details', {
                method: 'POST',
                body: JSON.stringify({
                    planNumber: planNumber
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data: Response = await res.json();

            if (data.error) {
                throw new Error(data.message);
            }

            if (data.data) {
                setDetailedPropery(data.data);
            }

            setIsLoading(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setError(message);
            setIsLoading(false);
        }
    };

    return (
        <section className={classes.container}>
            <label htmlFor='plan' className={classes.label}>
                Search for property details by plan number:
            </label>
            <input className={classes.input} type='number' id='plan' placeholder='3423' ref={planNumberRef} />

            <Button
                type='button'
                classType='secondary'
                value={isLoading ? 'Searching ...' : 'Search'}
                onClick={retrievePropertyDetailsHandler}
            />

            {error && <p className={cn(classes.response, classes['response--error'])}>{error}</p>}

            {detailedProperty && !error && (
                <section className={classes['details-container']}>
                    <label className={classes.label}>Name</label>
                    <p>{detailedProperty.name}</p>

                    <label className={classes.label}>Plan number</label>
                    <p>{detailedProperty.plan}</p>

                    <label className={classes.label}>Units</label>
                    {detailedProperty.units.map((unit: Unit, index) => (
                        <article key={unit.id}>
                            <header className={classes.header}>Unit {++index}</header>
                            <p>{unit.lotAlpha}</p>
                            <p>{unit.floor}</p>
                            <p>{unit.type}</p>
                        </article>
                    ))}

                    <label className={classes.label}>City</label>
                    <p>{detailedProperty.city}</p>

                    <label className={classes.label}>Region name</label>
                    <p>{detailedProperty.region.name}</p>

                    <label className={classes.label}>Current Manager first name</label>
                    <p>{detailedProperty.manager.firstName}</p>

                    <label className={classes.label}>Current Manager last name</label>
                    <p>{detailedProperty.manager.lastName}</p>

                    <label className={classes.label}>Current Manager managed since</label>
                    <p>{detailedProperty.manager.managedSince}</p>

                    <label className={classes.label}>Previous Manager first name</label>
                    <p>{detailedProperty.previousManager.firstName}</p>

                    <label className={classes.label}>Previous Manager last name</label>
                    <p>{detailedProperty.previousManager.lastName}</p>

                    <label className={classes.label}>Previous Manager managed since</label>
                    <p>{detailedProperty.previousManager.managedSince}</p>

                    <label className={classes.label}>Management Company</label>
                    <p>{detailedProperty.managementCompany}</p>

                    <label className={classes.label}>Plan Registered Date</label>
                    <p>{detailedProperty.planRegistered}</p>

                    <label className={classes.label}>Address</label>
                    <p>{detailedProperty.address}</p>

                    <label className={classes.label}>Account</label>
                    <p>{detailedProperty.account}</p>

                    <label className={classes.label}>ABN</label>
                    <p>{detailedProperty.abn}</p>
                </section>
            )}
        </section>
    );
};

export default DetailsProperty;

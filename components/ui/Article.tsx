import React, { useState } from 'react';

import { ViewProperty } from '../../types/property';
import { Button } from '../';
import classes from './article.module.scss';

type Response = {
    error: boolean;
    message: string;
};

type Props = {
    property: ViewProperty;
    setProperties: React.Dispatch<React.SetStateAction<ViewProperty[]>>;
    setOnDeleteError: React.Dispatch<React.SetStateAction<string>>;
};

const Article: React.FC<Props> = ({ property, setProperties, setOnDeleteError }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const propertyDeleteHandler = async () => {
        try {
            setIsDeleting(true);
            const res = await fetch('/api/properties/delete', {
                method: 'POST',
                body: JSON.stringify({
                    viewPropertyId: property.id,
                    detailedPropertyId: property.detailedPropertyId,
                    plan: property.plan,
                    deleting: true
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data: Response = await res.json();

            if (data.error) {
                throw new Error(data.message);
            } else {
                setProperties(prevState => {
                    const newState = prevState.filter(prop => prop !== property);
                    return newState;
                });
            }
            setIsDeleting(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setOnDeleteError(message);
            setIsDeleting(false);
        }
    };

    return (
        <article className={classes.container}>
            <h4 className={classes.data_container}>{property.name}</h4>
            <p className={classes.data_container}>{property.plan}</p>
            <p className={classes.data_container}>{property.unitCount}</p>
            <p className={classes.data_container}>{property.city}</p>
            <p className={classes.data_container}>{property.region}</p>
            <p className={classes.data_container}>{property.manager}</p>
            <p className={classes.data_container}>{property.managedSince}</p>

            <Button
                type='button'
                classType='tertiary'
                value={isDeleting ? 'Deleting ...' : 'Delete'}
                onClick={propertyDeleteHandler}
            />
        </article>
    );
};

export default Article;

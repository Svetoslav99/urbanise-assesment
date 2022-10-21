import React from 'react';

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
};

const Article: React.FC<Props> = ({ property, setProperties }) => {
    const propertyDeleteHandler = async () => {
        // post request with the property id ( from there we can delete the detailedProperty also, since we have its id)
        console.log('property.id: ', property.id);
        console.log('property.detailedPropertyId: ', property.detailedPropertyId);

        try {
            const res = await fetch('/api/properties/id', {
                method: 'POST',
                body: JSON.stringify({
                    ViewPropertyId: property.id,
                    DetailedPropertyId: property.detailedPropertyId,
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
        } catch (error) {}
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

            <Button type='button' classType='tertiary' value='Delete' onClick={propertyDeleteHandler} />
        </article>
    );
};

export default Article;

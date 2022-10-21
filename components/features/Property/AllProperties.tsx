import React from 'react';

import { ViewProperty } from '../../../types/property';
import Article from '../../ui/Article';
import classes from './allProperties.module.scss';

type Props = {
    properties: ViewProperty[];
    setProperties: React.Dispatch<React.SetStateAction<ViewProperty[]>>;
    error: string;
    isLoading: boolean;
};

const AllProperties: React.FC<Props> = ({ properties, setProperties, error, isLoading }) => {
    if (error) {
        return <h3 className={classes.error}>{error}</h3>;
    }

    if (isLoading) {
        return <h3>Loading...</h3>;
    }

    if (!properties || properties.length === 0) {
        return <h2>Nothing to show!</h2>;
    }

    return (
        <section className={classes.container}>
            <h2 className={classes.title}>Properties</h2>

            <div className={classes.headers}>
                <h3 className={classes.data_container}>Property name</h3>
                <h3 className={classes.data_container}>Plan Number</h3>
                <h3 className={classes.data_container}>Unit Count</h3>
                <h3 className={classes.data_container}>City</h3>
                <h3 className={classes.data_container}>Region</h3>
                <h3 className={classes.data_container}>Manager</h3>
                <h3 className={classes.data_container}>Managed since</h3>
                <h3 className={classes.data_container}>Delete</h3>
            </div>
            <hr className={classes.hr} />

            {properties.map((property: ViewProperty) => (
                <Article key={+property.id} property={property} />
            ))}
        </section>
    );
};

export default AllProperties;

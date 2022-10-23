import { ViewProperty } from '@prisma/client';
import React, { useState } from 'react';

import Search from '../Search/Search';
import AllProperties from './AllProperties';
import classes from './properties.module.scss';

const Properties: React.FC = () => {
    const [properties, setProperties] = useState<ViewProperty[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <section className={classes['filter-container']}>
                <Search setProperties={setProperties} setError={setError} setIsLoading={setIsLoading} />
            </section>
            <section className={classes['list-items-container']}>
                <AllProperties properties={properties} setProperties={setProperties} error={error} isLoading={isLoading}  />
            </section>
        </>
    );
};

export default Properties;
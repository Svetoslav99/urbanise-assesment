import Head from 'next/head';
import React from 'react';

import { DetailsProperty } from '../components';

const Index: React.FC = () => {
    return (
        <>
            <Head>
                <title>Property Details</title>
                <meta name='description' content='Property details page based on provided plan number.' />
            </Head>
            <DetailsProperty />
        </>
    );
};

export default Index;

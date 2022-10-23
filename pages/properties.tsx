import React from 'react';
import Head from 'next/head';

import { Properties } from '../components';

const Index: React.FC = () => {
    return (
        <>
            <Head>
                <title>Properties</title>
                <meta
                    name='description'
                    content='Properties page. From here you can search for a specific property or to delete a property.'
                />
            </Head>
            <Properties />
        </>
    );
};

export default Index;

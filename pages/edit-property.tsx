import React from 'react';
import Head from 'next/head';

import { EditProperty } from '../components';

const Index: React.FC = () => {
    return (
        <>
            <Head>
                <title>Edit property</title>
                <meta name='description' content='Edit property based on its plan number.' />
            </Head>
            <EditProperty />
        </>
    );
};

export default Index;

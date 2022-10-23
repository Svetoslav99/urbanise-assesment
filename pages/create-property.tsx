import React from 'react';
import Head from 'next/head';

import { CreateProperty } from '../components';

const Index: React.FC = () => {
    return (
        <>
            <Head>
                <title>Create property</title>
                <meta name='description' content='Create new property page.' />
            </Head>
            <CreateProperty />
        </>
    );
};

export default Index;

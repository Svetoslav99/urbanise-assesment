import React from 'react';
import Head from 'next/head';

const Index: React.FC = () => {
    return (
        <>
            <Head>
                <title>Urbanise assesment</title>
                <meta name='description' content='Front end assesment.' />
            </Head>
            <h2>Welcome to the app! Please use the navigation to have look around!</h2>
        </>
    );
};

export default Index;

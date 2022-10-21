import { useEffect, useState } from 'react';
import Router from 'next/router';
import type { AppProps } from 'next/app';

import { Layout } from '../components';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const start = () => {
            setLoading(true);
        };
        const end = () => {
            setLoading(false);
        };
        Router.events.on('routeChangeStart', start);
        Router.events.on('routeChangeComplete', end);
        Router.events.on('routeChangeError', end);
        return () => {
            Router.events.off('routeChangeStart', start);
            Router.events.off('routeChangeComplete', end);
            Router.events.off('routeChangeError', end);
        };
    }, []);
    return isLoading ? (
        <Layout>
            <h1>Loading ...</h1>
        </Layout>
    ) : (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;

import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';

import { Manager } from '@prisma/client';
import { ShowManager } from '../../components';
import { ParsedUrlQuery } from 'querystring';

// Any route like /manager/1, /manager/abc, etc. will be matched by pages/manager/[id].tsx.
const Index: React.FC<{ manager: Manager }> = ({ manager }) => {
    const router = useRouter();

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <h2>Loading ...</h2>;
    }

    return <ShowManager managerData={manager} />;
};

export default Index;

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
    // Call an external API endpoint to get managers
    const res = await fetch(`${process.env.HOST_ADDRESS}/api/manager`);
    const managers = await res.json();

    // Get the paths we want to pre-render based on managers
    const paths = managers.data.map((manager: Manager) => ({
        params: { id: manager.id }
    }));

    // We'll pre-render only these paths at build time.
    // With fallback 'blocking' we will build on visit the new ones and then cache them for the next visit.
    return { paths, fallback: 'blocking' };
};

interface IParams extends ParsedUrlQuery {
    id: string;
}

export const getStaticProps: GetStaticProps = async context => {
    const { id } = context.params as IParams;

    // params contains the manager `id`.
    const res = await fetch(`${process.env.HOST_ADDRESS}/api/manager/${id}`);

    const managerData = await res.json();

    const manager = managerData.data;

    // Pass manager data to the page via props
    return { props: { manager } };
};

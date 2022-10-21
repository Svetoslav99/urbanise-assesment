import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ShowManager } from '../../components';
import Manager from '../../types/manager';

type ResponseData = {
    message: string;
    error: boolean;
    data: Manager | null;
};

// Any route like /manager/1, /manager/abc, etc. will be matched by pages/manager/[id].tsx.
const Index: React.FC = () => {
    const [managerData, setManagerData] = useState<Manager | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>();
    const [error, setError] = useState<string>('');

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${process.env.HOST_ADDRESS}/api/manager/${id}`);

                const data: ResponseData = await res.json();

                if (data.error) {
                    setError(data.message);
                    setManagerData(null);
                } else {
                    error && setError('');
                    setManagerData(data.data);
                }

                setIsLoading(false);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                setError(message);
                setIsLoading(false);
            }
        });

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <h2>Loading ...</h2>;
    }

    return <ShowManager managerData={managerData} />;
};

export default Index;

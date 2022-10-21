import { ShowRegions } from '../components';
import Region from '../types/region';

type ResponseData = {
    message: string;
    error: boolean;
    data: Region[] | null;
};

const Index: React.FC<ResponseData> = ({message, error, data}) => {
    return <ShowRegions message={message} error={error} data={data} />
};

export default Index;

export async function getServerSideProps() {
    const res = await fetch(`${process.env.HOST_ADDRESS}/api/regions`);
    const data: ResponseData = await res.json();

    return {
        props: {
            message: data.message,
            error: data.error,
            regions: data.data
        }
    };
}

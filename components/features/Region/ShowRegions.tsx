import Region from '../../../types/region';

type Props = {
    message: string;
    error: boolean;
    data: Region[] | null;
};

const ShowRegions: React.FC<Props> = ({ message, error, data }) => {
    if (error || !data) {
        return <h2>{message}</h2>;
    }

    return (
        <section>
            {data.map((region: Region, index) => (
                <article key={region.id}>
                    <p>{region.id}</p>
                    <p>{region.name}</p>
                </article>
            ))}
        </section>
    );
};

export default ShowRegions;

import Region from '../../../types/region';
import classes from './showRegions.module.scss';

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
        <section className={classes.container}>
            <h2>Regions</h2>
            <hr className={classes.hr} />
            {data.map((region: Region, index) => (
                <article key={region.id} className={classes.article}>
                    <h3>Region ID</h3>
                    <p>{region.id}</p>
                    <h3>Region Name</h3>
                    <p>{region.name}</p>
                    <hr className={classes['hr--big']} />
                </article>
            ))}
        </section>
    );
};

export default ShowRegions;

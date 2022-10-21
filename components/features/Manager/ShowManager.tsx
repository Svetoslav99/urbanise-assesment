import Manager from '../../../types/manager';
import classes from './showManager.module.scss';

type Props = {
    managerData: Manager | null;
};

const ShowManager: React.FC<Props> = ({ managerData }) => {
    if (!managerData) {
        return <h2>There is no data in the database for a manager with that ID!</h2>;
    }

    return (
        <section>
            <title>Manager information</title>
            <p>{managerData.firstName}</p>
            <p>{managerData.lastName}</p>
            <p>{managerData.managedSince}</p>
        </section>
    );
};

export default ShowManager;

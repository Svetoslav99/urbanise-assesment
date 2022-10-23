import { Manager } from '@prisma/client';

import classes from './showManager.module.scss';

type Props = {
    managerData: Manager | null;
};

const ShowManager: React.FC<Props> = ({ managerData }) => {
    if (!managerData) {
        return <h2>There is no data in the database for a manager with that ID!</h2>;
    }

    return (
        <section className={classes.container}>
            <h2 className={classes.title}>Manager information for id {managerData.id}</h2>

            <hr className={classes.hr} />

            <h3>First Name</h3>
            <p>{managerData.firstName}</p>
            <h3>Last Name</h3>
            <p>{managerData.lastName}</p>
            <h3>Managed Since</h3>
            <p>{managerData.managedSince.toLocaleString()}</p>
        </section>
    );
};

export default ShowManager;

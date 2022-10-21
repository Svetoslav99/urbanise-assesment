import React from 'react';
import Link from 'next/link';

import classes from './navbar.module.scss';

const Navbar: React.FC = () => {
    return (
        <nav className={classes.container}>
            <ul className={classes.container__navigation}>
                <li className={classes.item}>
                    <Link href='/property-details'>Property details</Link>
                </li>
                <li className={classes.item}>
                    <Link href='/create-property'>Create Property</Link>{' '}
                    {/** + options for creating and deleting a manager */}
                </li>
                <li className={classes.item}>
                    <Link href='/properties'>All Properties</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;

import React from 'react';

import { Navbar } from '../';
import classes from './layout.module.scss';

type Props = {
    children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <>
            <Navbar />
            <main className={classes.container}>{children}</main>
        </>
    );
};

export default Layout;

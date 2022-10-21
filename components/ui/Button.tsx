import React from 'react';
import cn from 'classnames';

import classes from './button.module.scss';

type Props = {
    classType: string;
    type: 'button' | 'submit';
    value: string;
    onClick?: (e: React.MouseEvent) => void;
};

const Button: React.FC<Props> = ({ classType, type, value, onClick }) => {
    switch (classType) {
        case 'primary':
            return (
                <button type={type} className={cn(classes.button, classes['button__primary'])}>
                    {value}
                </button>
            );
        case 'secondary':
            return (
                <button type={type} className={cn(classes.button, classes['button__secondary'])} onClick={onClick}>
                    {value}
                </button>
            );
        case 'tertiary':
            return (
                <button
                    type={type}
                    className={cn(classes.button, classes['button__secondary'], classes.data_container)}
                    onClick={onClick}
                >
                    {value}
                </button>
            );
        default:
            return (
                <button type={type} className={classes.button}>
                    {value}
                </button>
            );
    }
};

export default Button;

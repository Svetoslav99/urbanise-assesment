import React, { useState, useEffect } from 'react';

import { ViewProperty } from '../../../types/property';
import classes from './search.module.scss';

type Props = {
    setProperties: React.Dispatch<React.SetStateAction<ViewProperty[]>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type Response = {
    message: string;
    error: boolean;
    data: ViewProperty[] | null;
};

const Search: React.FC<Props> = ({ setProperties, setError, setIsLoading }) => {
    // Allow for searching by name and plan number and for filtering by region.
    const [nameInputValue, setNameInputValue] = useState('');
    const [planNumberInputValue, setPlanNumberInputValue] = useState<number>();
    const [regionInputValue, setRegionInputValue] = useState('');

    useEffect(() => {
        const timer = setTimeout(async () => {
            // if (!nameInputValue && (planNumberInputValue === 0 || !planNumberInputValue) && !regionInputValue) {
            //     setProperties([]);
            //     return;
            // }

            try {
                setIsLoading(true);

                const res = await fetch('/api/properties/filtered-properties', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: nameInputValue,
                        planNumber: planNumberInputValue,
                        region: regionInputValue
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                const data: Response = await res.json();

                console.log('data in the FE: ', data);

                if (data.error) {
                    throw new Error(data.message);
                }

                if (data.data) {
                    setProperties(data.data);
                } else {
                    setProperties([]);
                }

                setIsLoading(false);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                setError(message);
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [nameInputValue, planNumberInputValue, regionInputValue]);

    const nameInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameInputValue(e.target.value);
    };

    const planNumberInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlanNumberInputValue(+e.target.value);
    };

    const regionInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegionInputValue(e.target.value);
    };

    return (
        <>
            <div className={classes.container}>
                <label className={classes.label}>Search by name: </label>
                <input
                    className={classes.input}
                    value={nameInputValue}
                    type='text'
                    onChange={nameInputChangeHandler}
                    placeholder='Apartment 1'
                />
            </div>

            <div className={classes.container}>
                <label className={classes.label}>Search by plan Number: </label>
                <input
                    className={classes.input}
                    value={planNumberInputValue}
                    type='number'
                    onChange={planNumberInputChangeHandler}
                    placeholder='3422'
                />
            </div>

            <div className={classes.container}>
                <label className={classes.label}>Search by region: </label>
                <input
                    className={classes.input}
                    value={regionInputValue}
                    type='string'
                    onChange={regionInputChangeHandler}
                    placeholder='Sofia'
                />
            </div>
        </>
    );
};

export default Search;

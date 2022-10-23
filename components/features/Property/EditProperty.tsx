import React, { useRef, useState } from 'react';
import { Formik, Field, FieldArray } from 'formik';
import { Unit } from '@prisma/client';
import cn from 'classnames';

import { Button } from '../../';
import { DetailedProperty } from '../../../types/property';
import classes from './editProperty.module.scss';

type Response = {
    error: boolean;
    message: string;
    data: DetailedProperty | null;
};

const EditProperty:React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [detailedProperty, setDetailedPropery] = useState<DetailedProperty>();
    const [units, setUnits] = useState<Unit[]>([]);
    const planNumberRef = useRef<HTMLInputElement>(null);

    const retrievePropertyDetailsHandler = async (e: React.MouseEvent) => {
        const planNumber = planNumberRef.current!.value;

        try {
            setIsLoading(true);
            error && setError('');
            successMessage && setSuccessMessage('');

            const res = await fetch('/api/properties/details', {
                method: 'POST',
                body: JSON.stringify({
                    planNumber: planNumber
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data: Response = await res.json();

            if (data.error) {
                throw new Error(data.message);
            }

            if (data.data) {
                setDetailedPropery(data.data);

                if (data.data.units.length > 0) {
                    const units = data.data.units as Unit[];
                    setUnits(units);
                } else {
                    setUnits([]);
                }
            }

            setIsLoading(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setError(message);
            setIsLoading(false);
        }
    };

    return (
        <>
            <section className={classes.container}>
                <label htmlFor='plan' className={classes.label}>
                    Search for property details by plan number:
                </label>
                <input
                    className={cn(classes.input, classes['input--small'])}
                    type='number'
                    id='plan'
                    placeholder='3423'
                    ref={planNumberRef}
                />

                <Button
                    type='button'
                    classType='secondary'
                    value={isLoading ? 'Searching ...' : 'Search'}
                    onClick={retrievePropertyDetailsHandler}
                />
            </section>

            {detailedProperty && (
                <section>
                    <Formik
                        initialValues={{
                            name: detailedProperty.name,
                            plan: detailedProperty.plan,
                            units: units,
                            city: detailedProperty.city,
                            region: detailedProperty.region,
                            manager: detailedProperty.manager,
                            previousManager: detailedProperty.previousManager,
                            managementCompany: detailedProperty.managementCompany,
                            planRegistered: detailedProperty.planRegistered,
                            address: detailedProperty.address,
                            account: detailedProperty.account,
                            abn: detailedProperty.abn
                        }}
                        onSubmit={async (values, actions) => {
                            console.log('values: ', values);

                            if (!values.name) {
                                setError('Name field is required!');
                                return;
                            }

                            if (!values.plan) {
                                setError('Plan field is required!');
                                return;
                            }

                            if (!values.units || values.units.length === 0) {
                                setError('Atleast one unit field is required!');
                                return;
                            }

                            units.forEach((unit: Unit) => {
                                if (!unit.floor || unit.floor < -1) {
                                    setError('Unit floor is required and should be greater than -1!');
                                    return;
                                }

                                if (!unit.lotAlpha) {
                                    setError('Unit lot Alpha is required!');
                                    return;
                                }

                                if (!unit.type) {
                                    setError('Unit Type is required!');
                                    return;
                                }
                            });

                            if (!values.city) {
                                setError('City field is required!');
                                return;
                            }

                            if (!values.region) {
                                setError('Region field is required!');
                                return;
                            }

                            if (!values.manager.firstName) {
                                setError('Current Manager first name field is required!');
                                return;
                            }

                            if (!values.manager.lastName) {
                                setError('Current Manager last name field is required!');
                                return;
                            }

                            let isValidDate = values.manager.managedSince.match(/^\d{4}-\d{2}-\d{2}$/);
                            if (!isValidDate) {
                                setError('Manager managed since field is invalid! The format should be "YYYY-MM-DD"!');
                                return;
                            }

                            if (!values.manager.managedSince) {
                                setError('Current Manager managed since field is required!');
                                return;
                            }

                            if (!values.previousManager.firstName) {
                                setError('Previous Manager first name field is required!');
                                return;
                            }
                            if (!values.previousManager.lastName) {
                                setError('Previous Manager last name field is required!');
                                return;
                            }
                            if (!values.previousManager.managedSince) {
                                setError('Previous Manager managed since field is required!');
                                return;
                            }

                            isValidDate = values.previousManager.managedSince.match(/^\d{4}-\d{2}-\d{2}$/);
                            if (!isValidDate) {
                                setError(
                                    'Previous Manager managed since field is invalid! The format should be "YYYY-MM-DD"!'
                                );
                                return;
                            }

                            if (!values.managementCompany) {
                                setError('Management Company field is required!');
                                return;
                            }

                            if (!values.planRegistered) {
                                setError('Plan Registered field is required!');
                                return;
                            }

                            isValidDate = values.planRegistered.match(/^\d{4}-\d{2}-\d{2}$/);
                            if (!isValidDate) {
                                setError('Plan Registered field is invalid! The format should be "DD/MM/YYYY"!');
                                return;
                            }

                            if (!values.address) {
                                setError('Address field is required!');
                                return;
                            }

                            if (!values.account) {
                                setError('Account field is required!');
                                return;
                            }

                            if (!values.abn) {
                                setError('Abn field is required!');
                                return;
                            }

                            try {
                                actions.setSubmitting(true);
                                const res = await fetch('/api/properties/edit', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        id: detailedProperty.id,
                                        name: values.name,
                                        plan: values.plan,
                                        units: values.units,
                                        city: values.city,
                                        region: values.region,
                                        manager: values.manager,
                                        previousManager: values.previousManager,
                                        managementCompany: values.managementCompany,
                                        planRegistered: values.planRegistered,
                                        address: values.address,
                                        account: values.account,
                                        abn: values.abn
                                    }),
                                    headers: { 'Content-Type': 'application/json' }
                                });

                                const data: Response = await res.json();

                                if (data.error) {
                                    throw new Error(data.message);
                                }

                                setSuccessMessage(data.message);
                            } catch (error) {
                                const message = error instanceof Error ? error.message : String(error);
                                setError(message);
                            }

                            actions.setSubmitting(false);
                        }}
                        render={({ values, handleSubmit, isSubmitting }) => (
                            <form
                                className={cn(classes.container, classes['container--property'])}
                                onSubmit={handleSubmit}
                            >
                                <h2 className={classes.header}>Edit property</h2>

                                <label htmlFor='name' className={classes.label}>
                                    Name
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='name'
                                    id='name'
                                    type='text'
                                />

                                <label htmlFor='plan' className={classes.label}>
                                    Plan number
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='plan'
                                    id='plan'
                                    type='string'
                                />

                                <label className={classes.label}>Units</label>
                                <FieldArray
                                    name='units'
                                    render={arrayHelpers => (
                                        <div style={{ width: '30vw', textAlign: 'center' }}>
                                            {values.units.map((unit, index) => (
                                                <div className='row' key={index}>
                                                    <div className='col'>
                                                        <label htmlFor={`units.${index}.lotAlpha`}>Unit lotAlpha</label>
                                                        <Field
                                                            className={cn(classes.input, classes['input--small'])}
                                                            name={`units.${index}.lotAlpha`}
                                                            placeholder='1'
                                                            type='number'
                                                        />
                                                    </div>

                                                    <div className='col'>
                                                        <label htmlFor={`units.${index}.floor`}>Unit floor</label>
                                                        <Field
                                                            className={cn(classes.input, classes['input--small'])}
                                                            name={`units.${index}.floor`}
                                                            placeholder='3'
                                                            type='number'
                                                        />
                                                    </div>

                                                    <div className='col'>
                                                        <label htmlFor={`units.${index}.type`}>Unit type</label>
                                                        <Field
                                                            className={cn(classes.input, classes['input--small'])}
                                                            name={`units.${index}.type`}
                                                            placeholder='Residential'
                                                            type='string'
                                                        />
                                                    </div>

                                                    <div className='col'>
                                                        <Button
                                                            type='button'
                                                            classType='secondary'
                                                            value='Remove unit'
                                                            onClick={() => arrayHelpers.remove(index)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}

                                            <Button
                                                type='button'
                                                classType='secondary'
                                                value='Add unit'
                                                onClick={() => arrayHelpers.push('')}
                                            />
                                        </div>
                                    )}
                                />

                                <label htmlFor='city' className={classes.label}>
                                    City
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='city'
                                    id='city'
                                    type='text'
                                />

                                <label htmlFor='region.name' className={classes.label}>
                                    Region name
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='region.name'
                                    id='region.name'
                                    type='text'
                                />

                                <label htmlFor='manager.firstName' className={classes.label}>
                                    Current Manager first name
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='manager.firstName'
                                    id='manager.firstName'
                                    type='text'
                                />

                                <label htmlFor='manager.lastName' className={classes.label}>
                                    Current Manager last name
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='manager.lastName'
                                    id='manager.lastName'
                                    type='text'
                                />

                                <label htmlFor='manager.managedSince' className={classes.label}>
                                    Current Manager managed since
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='manager.managedSince'
                                    id='manager.managedSince'
                                    type='text'
                                />

                                <label htmlFor='previousManager.firstName' className={classes.label}>
                                    Previous Manager first name
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='previousManager.firstName'
                                    id='previousManager.firstName'
                                    type='text'
                                />

                                <label htmlFor='previousManager.lastName' className={classes.label}>
                                    Previous Manager last name
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='previousManager.lastName'
                                    id='previousManager.lastName'
                                    type='text'
                                />

                                <label htmlFor='previousManager.managedSince' className={classes.label}>
                                    Previous Manager managed since
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='previousManager.managedSince'
                                    id='previousManager.managedSince'
                                    type='text'
                                />

                                <label htmlFor='managementCompany' className={classes.label}>
                                    Management Company
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='managementCompany'
                                    id='managementCompany'
                                    type='text'
                                />

                                <label htmlFor='planRegistered' className={classes.label}>
                                    Plan Registered Date
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='planRegistered'
                                    id='planRegistered'
                                    type='text'
                                />

                                <label htmlFor='address' className={classes.label}>
                                    Address
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'], classes['input--textarea'])}
                                    name='address'
                                    id='address'
                                    type='text'
                                    as='textarea'
                                    rows='4'
                                />

                                <label htmlFor='account' className={classes.label}>
                                    Account
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='account'
                                    id='account'
                                    type='text'
                                />

                                <label htmlFor='abn' className={classes.label}>
                                    ABN
                                </label>
                                <Field
                                    className={cn(classes.input, classes['input--small'])}
                                    name='abn'
                                    id='abn'
                                    type='text'
                                />

                                <div className={classes['button-container']}>
                                    <Button
                                        type='submit'
                                        classType='primary'
                                        value={isSubmitting ? 'Updating Property ...' : 'Update Property'}
                                    />
                                </div>

                                {successMessage && (
                                    <p className={cn(classes.response, classes['response--success'])}>
                                        {successMessage}
                                    </p>
                                )}
                            </form>
                        )}
                    />
                </section>
            )}
            {error && <p className={cn(classes.response, classes['response--error'])}>{error}</p>}
        </>
    );
};

export default EditProperty;

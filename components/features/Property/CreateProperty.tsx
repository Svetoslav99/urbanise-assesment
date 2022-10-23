import { useState } from 'react';
import { Formik, Field, FieldArray } from 'formik';
import cn from 'classnames';

import Unit from '../../../types/unit';
import Manager from '../../../types/manager';
import Region from '../../../types/region';
import classes from './createProperty.module.scss';
import { Button } from '../..';

type ResponseData = {
    error: boolean;
    message: string;
};

const units: Unit[] = [];
const manager: Manager = { firstName: '', lastName: '', managedSince: '' };
const previousManager: Manager = { firstName: '', lastName: '', managedSince: '' };
const region: Region = { name: '' };

const CreateProperty: React.FC = () => {
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    return (
        <section>
            <Formik
                initialValues={{
                    name: '',
                    plan: '',
                    units: units,
                    city: '',
                    region: region,
                    manager: manager,
                    previousManager: previousManager,
                    managementCompany: '',
                    planRegistered: '',
                    address: '',
                    account: '',
                    abn: ''
                }}
                onSubmit={async (values, actions) => {
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

                    if (!values.managementCompany) {
                        setError('Management Company field is required!');
                        return;
                    }

                    if (!values.planRegistered) {
                        setError('Plan Registered field is required!');
                        return;
                    }

                    const isValidDate = values.planRegistered.match(/^\d{4}-\d{2}-\d{2}$/);
                    if (!isValidDate) {
                        setError('Plan Registered field is invalid! The format should be "YYYY-MM-DD"!');
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

                    const res = await fetch('/api/properties', {
                        method: 'POST',
                        body: JSON.stringify({
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

                    const data: ResponseData = await res.json();

                    if (data.error) {
                        successMessage && setSuccessMessage('');
                        setError(data.message);
                    } else {
                        error && setError('');
                        setSuccessMessage(data.message);
                    }

                    actions.setSubmitting(false);
                }}
                render={({ values, handleSubmit, isSubmitting }) => (
                    <form className={classes.container} onSubmit={handleSubmit}>
                        <h2 className={classes.title}>Add New Property</h2>

                        <label htmlFor='name' className={classes.label}>
                            Name
                        </label>
                        <Field className={classes.input} name='name' id='name' type='text' placeholder='Apartment 1' />

                        <label htmlFor='plan' className={classes.label}>
                            Plan number
                        </label>
                        <Field className={classes.input} name='plan' id='plan' type='string' placeholder='104231' />

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
                                                    className={classes.input}
                                                    name={`units.${index}.lotAlpha`}
                                                    placeholder='1'
                                                    type='number'
                                                />
                                            </div>

                                            <div className='col'>
                                                <label htmlFor={`units.${index}.floor`}>Unit floor</label>
                                                <Field
                                                    className={classes.input}
                                                    name={`units.${index}.floor`}
                                                    placeholder='3'
                                                    type='number'
                                                />
                                            </div>

                                            <div className='col'>
                                                <label htmlFor={`units.${index}.type`}>Unit type</label>
                                                <Field
                                                    className={classes.input}
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
                        <Field className={classes.input} name='city' id='city' type='text' placeholder='Sofia' />

                        <label htmlFor='region.name' className={classes.label}>
                            Region name
                        </label>
                        <Field
                            className={classes.input}
                            name='region.name'
                            id='region.name'
                            type='text'
                            placeholder='Sofia'
                        />

                        <label htmlFor='manager.firstName' className={classes.label}>
                            Current Manager first name
                        </label>
                        <Field
                            className={classes.input}
                            name='manager.firstName'
                            id='manager.firstName'
                            type='text'
                            placeholder='Ivan'
                        />

                        <label htmlFor='manager.lastName' className={classes.label}>
                            Current Manager last name
                        </label>
                        <Field
                            className={classes.input}
                            name='manager.lastName'
                            id='manager.lastName'
                            type='text'
                            placeholder='Ivanov'
                        />

                        <label htmlFor='manager.managedSince' className={classes.label}>
                            Current Manager managed since
                        </label>
                        <Field
                            className={classes.input}
                            name='manager.managedSince'
                            id='manager.managedSince'
                            type='text'
                            placeholder='2020-12-12'
                        />

                        <label htmlFor='previousManager.firstName' className={classes.label}>
                            Previous Manager first name
                        </label>
                        <Field
                            className={classes.input}
                            name='previousManager.firstName'
                            id='previousManager.firstName'
                            type='text'
                            placeholder='Georgi'
                        />

                        <label htmlFor='previousManager.lastName' className={classes.label}>
                            Previous Manager last name
                        </label>
                        <Field
                            className={classes.input}
                            name='previousManager.lastName'
                            id='previousManager.lastName'
                            type='text'
                            placeholder='Georgiev'
                        />

                        <label htmlFor='previousManager.managedSince' className={classes.label}>
                            Previous Manager managed since
                        </label>
                        <Field
                            className={classes.input}
                            name='previousManager.managedSince'
                            id='previousManager.managedSince'
                            type='text'
                            placeholder='2018-08-24'
                        />

                        <label htmlFor='managementCompany' className={classes.label}>
                            Management Company
                        </label>
                        <Field
                            className={classes.input}
                            name='managementCompany'
                            id='managementCompany'
                            type='text'
                            placeholder='ITX Ltd.'
                        />

                        <label htmlFor='planRegistered' className={classes.label}>
                            Plan Registered Date
                        </label>
                        <Field
                            className={classes.input}
                            name='planRegistered'
                            id='planRegistered'
                            type='text'
                            placeholder='2020-12-12'
                        />

                        <label htmlFor='address' className={classes.label}>
                            Address
                        </label>
                        <Field
                            className={cn(classes.input, classes['input--textarea'])}
                            name='address'
                            id='address'
                            type='text'
                            as='textarea'
                            placeholder='Bul. Staboliiski 120, vh. A, floor 3'
                            rows='4'
                        />

                        <label htmlFor='account' className={classes.label}>
                            Account
                        </label>
                        <Field className={classes.input} name='account' id='account' type='text' placeholder='acc' />

                        <label htmlFor='abn' className={classes.label}>
                            ABN
                        </label>
                        <Field className={classes.input} name='abn' id='abn' type='text' placeholder='ABN' />

                        <div className={classes['button-container']}>
                            <Button
                                type='submit'
                                classType='primary'
                                value={isSubmitting ? 'Adding Property ...' : 'Add Property'}
                            />
                        </div>

                        {error && <p className={cn(classes.response, classes['response--error'])}>{error}</p>}
                        {successMessage && (
                            <p className={cn(classes.response, classes['response--success'])}>{successMessage}</p>
                        )}
                    </form>
                )}
            />
        </section>
    );
};

export default CreateProperty;

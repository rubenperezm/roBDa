import React, { useEffect } from 'react';
import {
    TextField,
} from '@mui/material';

export const TopicsForm = (props) => {
    const { formik, values } = props;

    useEffect(() => {
        if (values)
            formik.setFieldValue('nombre', values.nombre);
        else
            formik.setFieldValue('nombre', '');
    }, [values]);

    return (
        <TextField
            error={!!(formik.touched.nombre && formik.errors.nombre)}
            fullWidth
            helperText={formik.touched.nombre && formik.errors.nombre}
            label="Nombre"
            name="nombre"
            required
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.nombre}
        />
    );
}


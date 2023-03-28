import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import axiosAuth from 'src/utils/axiosAuth';
import * as Yup from 'yup';
import {
    TextField,
} from '@mui/material';

export const TopicsForm = (props) => {
    const { topic, setSubmitHandler } = props;
    console.log('topic');
    console.log(topic);
    const formik = useFormik({
        initialValues: {
            nombre: topic.nombre ?? '',
            submit: null
        },
        validationSchema: Yup.object({
            nombre: Yup
                .string()
                .max(30)
                .required('Introduce un nombre para el tema'),
        }),
        onSubmit:
            async (values, helpers) => {
                try {
                    const body = {
                        nombre: values.nombre,
                    }

                    if (topic.id) {
                        await axiosAuth.put(`/api/questions/topics/${topic.id}`, body);
                    } else {
                        await axiosAuth.post('/api/questions/topics', body);
                    }

                } catch (err) {
                    helpers.setStatus({ success: false });
                    helpers.setErrors(err.response.data.error);
                    helpers.setSubmitting(false);
                }
            }
    });

    useEffect(() => {
        setSubmitHandler(() => formik.handleSubmit);
    }, [formik.handleSubmit, setSubmitHandler]);

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


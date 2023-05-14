import { useEffect } from 'react';
import { TextField } from '@mui/material';


const langs = [
    { id: 1, nombre: 'Español', abreviatura: 'Esp'},
    { id: 2, nombre: 'Inglés', abreviatura: 'Ing'},
];

export const LangSelection = (props) => {
    const { formik, defaultOption } = props;

    useEffect(() => {
        if (defaultOption && formik.values.idioma === '') {
            formik.setFieldValue('idioma', langs[0].id);
        }
    }, [formik.values.idioma, defaultOption]);

    return (
        <TextField
            error={!!(formik.touched.idioma && formik.errors.idioma)}
            helperText={formik.touched.idioma && formik.errors.idioma}
            fullWidth
            label="Idioma"
            name="idioma"
            select
            SelectProps={{ native: true }}
            value={formik.values.idioma}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
        >
            {langs.map((lang) => (
                <option key={lang.id} value={lang.id}>{lang.nombre}</option>
            ))}
        </TextField>
    )
}
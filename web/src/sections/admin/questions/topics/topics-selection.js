import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import axiosAuth from 'src/utils/axiosAuth';


export const TopicsSelection = (props) => {
    const { formik, emptyOption, defaultOption, disabled } = props;
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const getTopics = async () => {
            const res = await axiosAuth.get('/api/questions/topics').then(res => res.data);
            setTopics(res);
        };
        getTopics();
    }, []);

    useEffect(() => {
        if (defaultOption && topics.length > 0 && formik.values.tema === '') {
            formik.setFieldValue('tema', topics[0].nombre);
        }
    }, [formik.values.tema, defaultOption, topics]);

    return (
        <TextField
            disabled={disabled}
            error={!!(formik.touched.tema && formik.errors.tema)}
            helperText={formik.touched.tema && formik.errors.tema}
            fullWidth
            label="Tema"
            name="tema"
            select
            SelectProps={{ native: true }}
            value={formik.values.tema}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
        >
            {emptyOption && <option key="" value="">Todos</option>}
            {topics.map((topic) => (
                <option key={topic.id} value={topic.nombre}>{topic.nombre}</option>
            ))}
        </TextField>
    )
}
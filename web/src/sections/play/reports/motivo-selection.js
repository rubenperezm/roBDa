import { TextField } from '@mui/material';


const motivos = [
    { id: 1, label: 'Pregunta incorrecta'},
    { id: 2, label: 'Contenido inapropiado'},
    { id: 3, label: 'Otro'},
];

export const MotivoSelection = (props) => {
    const { formik } = props;

    return (
        <TextField
            error={!!(formik.touched.motivo && formik.errors.motivo)}
            helperText={formik.touched.motivo && formik.errors.motivo}
            fullWidth
            label="Motivo"
            name="motivo"
            select
            SelectProps={{ native: true }}
            value={formik.values.motivo}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
        >
            {motivos.map((motivo) => (
                <option key={motivo.id} value={motivo.id}>{motivo.label}</option>
            ))}
        </TextField>
    )
}
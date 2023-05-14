import { useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { Typography } from '@mui/material';

export const DistFecha = (props) => {
    const { fecha } = props;

    const [distFecha, setDistFecha] = useState(formatDistance(new Date(fecha), new Date(), { locale: es, addSuffix: true }));

    useEffect(() => {
        const fechaDate = new Date(fecha);
        const id = setInterval(() => {
            setDistFecha(formatDistance(fechaDate, new Date(), { locale: es, addSuffix: true }));
        }, 1000);

        return () => window.clearInterval(id);
    }, [fecha]);

    return (
        <Typography variant="body2" color="text.secondary">
            {distFecha}
        </Typography>
    );
}

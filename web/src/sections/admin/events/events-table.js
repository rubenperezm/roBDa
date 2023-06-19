import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { useCallback } from 'react';
import {
    Avatar,
    Box,
    Card,
    IconButton,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';
import { Scrollbar } from 'src/components/scrollbar';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import PlayIcon from '@heroicons/react/24/solid/PlayIcon';

export const EventsTable = (props) => {
    const { setPagina, pagina, eventos, numberOfResults, studentView } = props;

    const stateColor = (state) => {
        const colors = {
            'Sin comenzar': 'info',
            'Creación preguntas': 'warning',
            'En juego': 'success',
            'Esperando corrección del profesor': 'error',
            'Finalizada': 'error',
        };
        return colors[state];
    };

    const onPageChange = useCallback((event, newPage) => {
        setPagina(newPage);
    }, []);

    if (eventos.length === 0){
        return (
            <Card>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        color="textPrimary"
                        variant="body"
                    >
                        No hay competiciones que mostrar
                    </Typography>
                </Box>
            </Card>
        );
    }
    return (
        <Card>
            <Scrollbar>
                <TableContainer sx={{ minWidth: 800, maxHeight: 400 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Nombre
                                </TableCell>
                                <TableCell>
                                    Tema
                                </TableCell>
                                <TableCell>
                                    Idioma
                                </TableCell>
                                <TableCell>
                                    Fase Actual
                                </TableCell>
                                <TableCell>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {eventos.map((evento) => {
                                return (
                                    <TableRow
                                        hover
                                        key={evento.id}
                                    >
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Typography variant="subtitle2">
                                                    {evento.name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            {evento.tema}
                                        </TableCell>
                                        <TableCell>
                                            <Avatar
                                                src={`/assets/flags/${evento.idioma}.png`}>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <SeverityPill
                                                color={stateColor(evento.fase_actual)}
                                            >
                                                { evento.fase_actual }
                                            </SeverityPill>
                                        </TableCell>
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Tooltip title={studentView && evento.fase_actual !== 'Finalizada' ? "Ir a competición" : "Ver competición"}>
                                                    <IconButton
                                                        component={NextLink}
                                                        href={studentView ? `/competitions/${evento.id}` : `/admin/competitions/${evento.id}`}>
                                                        <SvgIcon fontSize="small">
                                                            {studentView && evento.fase_actual !== 'Finalizada' ? <PlayIcon /> : <EyeIcon />}
                                                        </SvgIcon>
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Scrollbar>
            <TablePagination
                rowsPerPageOptions={[]}
                rowsPerPage={30}
                component="div"
                count={numberOfResults}
                onPageChange={onPageChange}
                page={pagina}
            />
        </Card>
    );
};

EventsTable.propTypes = {
    numberOfResults: PropTypes.number,
    eventos: PropTypes.array,
    setPagina: PropTypes.func,
    pagina: PropTypes.number,
};

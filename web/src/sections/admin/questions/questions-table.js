import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import {
    Avatar,
    Box,
    Card,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';
import { Scrollbar } from 'src/components/scrollbar';
import { QuestionsFilters } from './questions-filters';

export const QuestionsTable = (props) => {
    const { setPagina, pagina, preguntas, numberOfResults } = props;

    const reportsColor = (reports) => {
        if (reports == 0)
            return 'success';
        else if (reports < 3)
            return 'warning';
        else
            return 'error';
    };

    const onPageChange = useCallback((event, newPage) => {
        setPagina(newPage);
    }, []);


    return (
        <Card>
            <Scrollbar>
                <Box sx={{ minWidth: 800 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Enunciado
                                </TableCell>
                                <TableCell>
                                    Creador
                                </TableCell>
                                <TableCell>
                                    Tema
                                </TableCell>
                                <TableCell>
                                    Idioma
                                </TableCell>
                                <TableCell>
                                    Evento
                                </TableCell>
                                <TableCell>
                                    Estado
                                </TableCell>
                                <TableCell>
                                    Reportes
                                </TableCell>
                                <TableCell>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {preguntas.map((question) => {
                                //const fecha = format(new Date(question.modificada), 'HH:mm - dd/MM/yyyy');
                                //const createdAt = fecha.toString();

                                return (
                                    <TableRow
                                        hover
                                        key={question.id}
                                    >
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Typography variant="subtitle2">
                                                    {question.enunciado}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            {question.creador}
                                        </TableCell>
                                        <TableCell>
                                            {question.tema}
                                        </TableCell>
                                        <TableCell>
                                            <Avatar
                                                src={`/assets/flags/${question.idioma}.png`}>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            {question.evento ? question.evento : 'Creada por profesor'}
                                        </TableCell>
                                        <TableCell>
                                            {question.estado}
                                        </TableCell>
                                        <TableCell>
                                            <SeverityPill
                                                color={reportsColor(question.notificaciones)}
                                            >
                                                {question.notificaciones}
                                            </SeverityPill>
                                        </TableCell>
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Typography variant="subtitle2">
                                                    Editar
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    Eliminar
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>
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

QuestionsTable.propTypes = {
    numberOfResults: PropTypes.number,
    preguntas: PropTypes.array,
    setPagina: PropTypes.func,
    pagina: PropTypes.number,
};

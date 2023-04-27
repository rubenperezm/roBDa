import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
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
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';
import { Scrollbar } from 'src/components/scrollbar';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';

export const QuestionsTable = (props) => {
    const { setPagina, pagina, preguntas, numberOfResults } = props;

    const stateColor = (state) => {
        const colors = {
            'Activa': 'success',
            'En evento': 'warning',
            'Reportada': 'error',
        };
        return colors[state];
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
                                <TableCell sx={{ textAlign: 'right' }}>
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
                                            <SeverityPill
                                                color={stateColor(question.estado)}
                                            >
                                                {question.estado} {question.estado === 'Reportada' && ` (${question.notificaciones})`}
                                            </SeverityPill>
                                        </TableCell>
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row-reverse"
                                                spacing={2}
                                            >
                                                <Tooltip title="Editar pregunta">
                                                    <IconButton
                                                        component={NextLink}
                                                        href={`/admin/questions/${question.id}`}>
                                                        <SvgIcon fontSize="small">
                                                            <PencilIcon />
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

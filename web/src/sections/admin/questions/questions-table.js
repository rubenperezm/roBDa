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

    if (preguntas.length === 0){
        return (
            <Card>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        color="textPrimary"
                        variant="body"
                    >
                        No hay preguntas que mostrar
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
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {preguntas.map((question) => {
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
                                                smallSize
                                            >
                                                {question.estado} {question.estado === 'Reportada' && ` (${question.notificaciones})`}
                                            </SeverityPill>
                                        </TableCell>
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Tooltip title="Ver pregunta">
                                                    <IconButton
                                                        component={NextLink}
                                                        href={`/admin/questions/${question.id}`}>
                                                        <SvgIcon fontSize="small">
                                                            <EyeIcon />
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

QuestionsTable.propTypes = {
    numberOfResults: PropTypes.number,
    preguntas: PropTypes.array,
    setPagina: PropTypes.func,
    pagina: PropTypes.number,
};

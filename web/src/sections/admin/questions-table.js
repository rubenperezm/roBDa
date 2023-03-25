import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { format } from 'date-fns';
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

export const QuestionsTable = (props) => {
    const [preguntas, setPreguntas] = useState([]);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const [pagina, setPagina] = useState(0);

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
    

    useEffect(() => {
        const getQuestions = async () => {
            const res = await axiosAuth.get(`/api/questions?page=${pagina+1}`).then(res => res.data);
            setPreguntas(res.results);
            setNumberOfResults(res.count);
        };
        getQuestions();
    }, [pagina]);


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
                                    Última modificación
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
                                const fecha = format(new Date(question.modificada), 'HH:mm - dd/MM/yyyy');
                                const createdAt = fecha.toString();

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
                                            {createdAt}
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
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    page: PropTypes.number,
};

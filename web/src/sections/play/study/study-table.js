import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { useCallback } from 'react';
import { intervalToDuration, formatDuration } from 'date-fns';
import { es } from 'date-fns/locale';
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

export const StudyTable = (props) => {
    const { setPagina, pagina, studies, numberOfResults } = props;

    const onPageChange = useCallback((event, newPage) => {
        setPagina(newPage);
    }, []);

    if (studies.length === 0){
        return (
            <Card>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        color="textPrimary"
                        variant="body"
                    >
                        No hay repasos que mostrar
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
                                    Usuario
                                </TableCell>
                                <TableCell>
                                    Tema
                                </TableCell>
                                <TableCell>
                                    Idioma
                                </TableCell>
                                <TableCell>
                                    Tiempo
                                </TableCell>
                                <TableCell>
                                    Porcentaje de acierto
                                </TableCell>
                                <TableCell>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {studies.map((study) => {
                                return (
                                    <TableRow
                                        hover
                                        key={study.partida.id}
                                    >
                                        <TableCell>
                                            {study.user}
                                        </TableCell>
                                        <TableCell>
                                            {study.partida.tema}
                                        </TableCell>
                                        <TableCell>
                                            <Avatar
                                                src={`/assets/flags/${study.partida.idioma}.png`}>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            { study.partida.tiempo > 0 ? formatDuration(intervalToDuration({ start: 0, end: study.partida.tiempo * 1000}), { locale: es }) : '-' }
                                        </TableCell>
                                        <TableCell>
                                            {study.partida.porcentajeAcierto}
                                        </TableCell>
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Tooltip title="Ver repaso">
                                                    <IconButton
                                                        component={NextLink}
                                                        href={`/admin/stats/study/${study.partida.id}`}>
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

StudyTable.propTypes = {
    numberOfResults: PropTypes.number,
    studies: PropTypes.array,
    setPagina: PropTypes.func,
    pagina: PropTypes.number,
};

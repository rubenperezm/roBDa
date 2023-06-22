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
import { Scrollbar } from 'src/components/scrollbar';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';

export const ParticipationsTable = (props) => {
    const { setPagina, pagina, participations, numberOfResults } = props;

    const onPageChange = useCallback((event, newPage) => {
        setPagina(newPage);
    }, []);

    if (participations.length === 0) {
        return (
            <Card>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        color="textPrimary"
                        variant="body"
                    >
                        No hay participaciones que mostrar
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
                                    Evento
                                </TableCell>
                                <TableCell>
                                    Puntuación
                                </TableCell>
                                <TableCell>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {participations.map((participation) => {
                                return (
                                    <TableRow
                                        hover
                                        key={participation.id}
                                    >
                                        <TableCell>
                                            {participation.user}
                                        </TableCell>
                                        <TableCell>
                                            {participation.evento}
                                        </TableCell>
                                        <TableCell>
                                            {participation.score}
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
                                                        href={`/admin/stats/competitions/${participation.id}`}>
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

ParticipationsTable.propTypes = {
    numberOfResults: PropTypes.number,
    participations: PropTypes.array,
    setPagina: PropTypes.func,
    pagina: PropTypes.number,
};

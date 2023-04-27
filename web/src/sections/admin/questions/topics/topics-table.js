import PropTypes from 'prop-types';
import { useCallback } from 'react';
import NextLink from 'next/link';
import {
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
import { Scrollbar } from 'src/components/scrollbar';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';

export const TopicsTable = (props) => {
    const { setPagina, pagina, temas, numberOfResults } = props;


    const onPageChange = useCallback((event, newPage) => {
        setPagina(newPage);
    }, []);

    return (
        <Card>
            <Scrollbar>
                <Box sx={{ minWidth: 300 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Nombre del tema
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {temas.map((tema) => {
                                return (
                                    <TableRow
                                        hover
                                        key={tema.id}
                                    >
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Typography variant="subtitle2">
                                                    {tema.nombre}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row-reverse"
                                                spacing={2}
                                            >
                                                <Tooltip title="Editar tema">
                                                    <IconButton
                                                        component={NextLink}
                                                        href={`/admin/questions/topics/${tema.id}`}>
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

TopicsTable.propTypes = {
    numberOfResults: PropTypes.number,
    temas: PropTypes.array,
    setPagina: PropTypes.func,
    pagina: PropTypes.number,
};

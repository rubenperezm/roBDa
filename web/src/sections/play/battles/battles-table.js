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
import { ActionsTableBattles, StateColor } from './battles-misc';

export const BattlesTable = (props) => {
    const { setPagina, pagina, battles, numberOfResults } = props;

    const onPageChange = useCallback((event, newPage) => {
        setPagina(newPage);
    }, []);

    if (battles.length === 0){
        return (
            <Card>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        color="textPrimary"
                        variant="body"
                    >
                        No hay duelos que mostrar
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
                                    Enfrentamiento
                                </TableCell>
                                <TableCell>
                                    Tema
                                </TableCell>
                                <TableCell>
                                    Idioma
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
                            {battles.map((battle) => {
                                return (
                                    <TableRow
                                        hover
                                        key={battle.id}
                                    >
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Typography variant="subtitle2">
                                                    {battle.user1} vs. {battle.user2}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            {battle.tema}
                                        </TableCell>
                                        <TableCell>
                                            <Avatar
                                                src={`/assets/flags/${battle.idioma}.png`}>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <StateColor estado={battle.estado} user1={battle.user1} smallSize/>
                                        </TableCell>
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                {/* <Tooltip title="Ver duelo">
                                                    <IconButton
                                                        component={NextLink}
                                                        href={`/battles/${battle.id}`}>
                                                        <SvgIcon fontSize="small">
                                                            <EyeIcon />
                                                        </SvgIcon>
                                                    </IconButton>
                                                </Tooltip> */}
                                                <ActionsTableBattles 
                                                    id={battle.id} 
                                                    estado={battle.estado} 
                                                    user1={battle.user1} 
                                                />
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

BattlesTable.propTypes = {
    numberOfResults: PropTypes.number,
    battles: PropTypes.array,
    setPagina: PropTypes.func,
    pagina: PropTypes.number,
};

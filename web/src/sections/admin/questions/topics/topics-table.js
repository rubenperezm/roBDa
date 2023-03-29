import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
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
import { TopicsDialogs } from './topics-dialogs';

export const TopicsTable = (props) => {
    const { getTopics, setPagina, pagina, temas, numberOfResults, openDialogCreate, setOpenDialogCreate } = props;
    const [topic, setTopic] = useState(null);
    const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    const showTopicDialog = useCallback((id) => {
        try{
            const getTopic = async () => {
                await axiosAuth.get(`/api/questions/topics/${id}`).then((res) => setTopic(res.data));
            };
            getTopic();
            setOpenDialogUpdate(true);
        } catch (error) {
            console.log("error");
        }
    }, []);

    const onPageChange = useCallback((event, newPage) => {
        setPagina(newPage);
    }, []);

    useEffect(() => {
        getTopics();
    }, [openDialogCreate, openDialogUpdate, openDialogDelete, pagina]);


    return (
        <Card>
            <TopicsDialogs 
                openDialogUpdate={openDialogUpdate}
                setOpenDialogUpdate={setOpenDialogUpdate}
                openDialogCreate={openDialogCreate}
                setOpenDialogCreate={setOpenDialogCreate}
                openDialogDelete={openDialogDelete}
                setOpenDialogDelete={setOpenDialogDelete}
                topic={topic}
                setTopic={setTopic}
            />
            <Scrollbar>
                <Box sx={{ minWidth: 300 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Nombre del tema
                                </TableCell>
                                <TableCell sx={{textAlign: 'right'}}>
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
                                                        onClick={() => showTopicDialog(tema.id)}
                                                    >
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

import {
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import axiosAuth from "src/utils/axiosAuth";
import { TopicsForm } from "./topics-form";

export const TopicsDialogs = (props) => {
    const { id, getTopics, openDialog, setOpenDialog } = props;
    const [submitHandler, setSubmitHandler] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [topic, setTopic] = useState({});

    const handleConfirmDelete = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        const deleteTopic = async () => {
            try{
            const res = await axiosAuth.delete(`/api/questions/topics/${id}`).then(res => res.data);
            } catch (error) {
                console.log(error);
            }
        };

        deleteTopic();

        setOpenDialog(false);
        setOpenConfirmDelete(false);
        setOpenAlert(true);
        setMessageAlert('Tema eliminado correctamente'); 
    };

    const handleCloseDialog = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenDialog(false);
    }, []);

    const handleCloseConfirmDelete = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenConfirmDelete(false);
    }, []);

    const handleCloseAlert = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }, []);

    useEffect(() => {
            const getTopic = async () => {
                if (id !== ''){
                    try{
                        const res = await axiosAuth.get(`/api/questions/topics/${id}`).then((res) => setTopic(res.data));
                        console.log(topic);
                    } catch (error) {
                        console.log("error");
                    }
                }
                
            };
            getTopic();   
    }, [id]);


    return (
        <>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Editar tema
                </DialogTitle>
                <DialogContent>
                    <TopicsForm topic={topic} setSubmitHandler={setSubmitHandler} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button type="submit" onClick={submitHandler}>{id ? "Editar" : "Crear"}</Button>
                    <Button onClick={() => setOpenConfirmDelete(true)}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openConfirmDelete}
                onClose={handleCloseConfirmDelete}
                aria-labelledby="alert-confirm-title"
                aria-describedby="alert-confirm-description"
            >
                <DialogTitle id="alert-confirm-title">
                    ¿Estás seguro de que quieres eliminar este tema?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-confirm-description">
                        Se eliminarán todas las preguntas y competiciones asociadas a este tema.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDelete}>Cancelar</Button>
                    <Button onClick={handleConfirmDelete} autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} variant="filled" severity="success" sx={{ width: "100%" }}>{messageAlert}</Alert>
            </Snackbar>
        </>
    );
}
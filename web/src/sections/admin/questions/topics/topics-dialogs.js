import {
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    CircularProgress,
} from "@mui/material";
import { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosAuth from "src/utils/axiosAuth";
import { TopicsForm } from "./topics-form";

export const TopicsDialogs = (props) => {
    const { topic,
            setTopic,
            openDialogUpdate,
            setOpenDialogUpdate,
            openDialogCreate,
            setOpenDialogCreate,
            openDialogDelete,
            setOpenDialogDelete,
        } = props;
    const [openAlert, setOpenAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');

    const formik = useFormik({
        initialValues: {
            nombre: topic ? topic.nombre : '',
            submit: null
        },
        validationSchema: Yup.object({
            nombre: Yup
                .string()
                .max(30)
                .required('Introduce un nombre para el tema'),
        }),
        onSubmit:
            async (values, helpers) => {
                try {
                    const body = {
                        nombre: values.nombre,
                    }

                    if (topic) {
                        await handleUpdate(topic, body);
                    } else {
                        await handleCreate(body);
                    }

                    helpers.setSubmitting(false);
                    helpers.resetForm();

                } catch (err) {
                    helpers.setStatus({ success: false });
                    helpers.setErrors(err.response.data.error);
                    helpers.setSubmitting(false);
                }
            }
    });
    
    const handleConfirmDelete = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        const deleteTopic = async () => {
            try {
                const res = await axiosAuth.delete(`/api/questions/topics/${topic.id}`).then(res => res.data);
            } catch (error) {
                //console.log(error);
            }
        };

        deleteTopic();

        setOpenDialogDelete(false);
        setOpenDialogUpdate(false);
        setMessageAlert('Tema eliminado correctamente');
        setOpenAlert(true);
        setTopic(null);
    };

    const handleCloseDialogUpdate = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenDialogUpdate(false);
        setTopic(null);
    }, []);

    const handleCloseDialogCreate = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenDialogCreate(false);
        setTopic(null);
    }, []);

    const handleCloseConfirmDelete = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenDialogDelete(false);
    }, []);

    const handleCreate = useCallback(async (body) => {
        await axiosAuth.post('/api/questions/topics', body);
        setOpenDialogCreate(false);
        setTopic(null);
        setMessageAlert('Tema creado correctamente');
        setOpenAlert(true);
    }, []);

    const handleUpdate = useCallback(async (topic, body) => {
        await axiosAuth.put(`/api/questions/topics/${topic.id}`, body);
        setOpenDialogUpdate(false);
        setTopic(null);
        setMessageAlert('Tema editado correctamente');
        setOpenAlert(true);
    }, []);

    const handleCloseAlert = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }, []);

    return (
        <>
            <Dialog // Create
                open={openDialogCreate}
                onClose={handleCloseDialogCreate}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Crear tema
                </DialogTitle>
                <DialogContent>
                    <TopicsForm formik={formik} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogCreate}>Cancelar</Button>
                    <Button type="submit" onClick={formik.handleSubmit} autoFocus>Crear</Button>
                </DialogActions>
            </Dialog>
            <Dialog // Update & delete topic dialog
                open={openDialogUpdate}
                onClose={handleCloseDialogUpdate}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {!topic ?
                    <DialogContent sx={{minWidth: "300px", display: "flex", justifyContent: "center"}}>
                        <CircularProgress />
                    </DialogContent>
                    :
                    <>
                        <DialogTitle id="alert-dialog-title">
                            Editar tema
                        </DialogTitle>
                        <DialogContent>
                            <TopicsForm values={topic} formik={formik}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialogUpdate}>Cancelar</Button>
                            <Button type="submit" onClick={formik.handleSubmit} autoFocus>Editar</Button>
                            <Button onClick={() => setOpenDialogDelete(true)}>
                                Eliminar
                            </Button>
                        </DialogActions>
                    </>
                }
            </Dialog>

            <Dialog // Confirm delete dialog
                open={openDialogDelete}
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
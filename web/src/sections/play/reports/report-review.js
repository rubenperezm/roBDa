import { useState } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import {
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Snackbar,
    Stack,
    SvgIcon,
    Tooltip,
    IconButton,
    DialogActions
} from "@mui/material";
import HandThumbDownIcon from '@heroicons/react/24/solid/HandThumbDownIcon';
import { ReportForm } from 'src/sections/play/reports/report-form';

export const ReportReview = (props) => {
    const { log, disabled, setDisabled, currentQuestion } = props;
    const [openDialogReport, setOpenDialogReport] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const handleCloseConfirmReport = () => {
        setOpenDialogReport(false);
    };

    const handleConfirmReport = (body) => {
        const sendReport = async () => {
            await axiosAuth.post('/api/play/report/', body);
        }
        sendReport();
        setOpenDialogReport(false);
        setShowAlert(true);
        setDisabled(currentQuestion);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowAlert(false);
    };


    return (
        <>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={showAlert} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: "100%" }}>Reporte enviado</Alert>
            </Snackbar>
            <Dialog
                open={openDialogReport}
                onClose={handleCloseConfirmReport}
            >
                <DialogTitle>
                    Reportar pregunta
                </DialogTitle>
                <DialogContent>
                    <ReportForm log={log} handleCloseConfirmReport={handleCloseConfirmReport} formHandler={handleConfirmReport} />
                </DialogContent>
            </Dialog>
            <Stack
                alignItems="center"
                direction="row"
                spacing={2}
            >
                {
                    disabled ? (
                        <IconButton
                            disabled={disabled}
                        >
                            <SvgIcon>
                                <HandThumbDownIcon />
                            </SvgIcon>
                        </IconButton>
                    ) : (
                        <Tooltip title="Reportar pregunta">
                            <span>
                                <IconButton
                                    onClick={() => setOpenDialogReport(true)}
                                >
                                    <SvgIcon>
                                        <HandThumbDownIcon />
                                    </SvgIcon>
                                </IconButton>
                            </span>
                        </Tooltip>
                    )
                }
            </Stack>
        </>
    )
}
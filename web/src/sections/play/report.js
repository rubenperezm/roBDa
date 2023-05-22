import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    SvgIcon,
    Tooltip,
    IconButton,
    DialogActions
} from "@mui/material";
import HandThumbDownIcon from '@heroicons/react/24/solid/HandThumbDownIcon';
import { ReportForm } from 'src/components/report-form';

export const Report = (props) => {
    const { question } = props;
    const [openDialogReport, setOpenDialogReport] = useState(false);

    const handleCloseConfirmReport = () => {
        setOpenDialogReport(false);
    };

    
    return (
        <>
        <Dialog
            open={openDialogReport}
            onClose={handleCloseConfirmReport}
        >
            <DialogTitle>
                Reportar pregunta
            </DialogTitle>
            <DialogContent>
                <ReportForm />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseConfirmReport} >
                    Cancelar
                </Button>
                <Button onClick={handleCloseConfirmReport} > {/* Cambiar por el handler*/}
                    Reportar
                </Button>
            </DialogActions>
        </Dialog>
        <Stack
            alignItems="center"
            direction="row"
            spacing={2}
        >
            <Tooltip title="Ver pregunta">
                <IconButton
                    onClick={() => setOpenDialogReport(true)}
                >
                    <SvgIcon>
                        <HandThumbDownIcon />
                    </SvgIcon>
                </IconButton>
            </Tooltip>
        </Stack>
        </>
    )
}
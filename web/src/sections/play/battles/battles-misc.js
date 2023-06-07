import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks/use-auth';
import axiosAuth from "src/utils/axiosAuth";
import {
    IconButton,
    SvgIcon,
    Tooltip,
    Typography,
} from '@mui/material';

import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import PlayIcon from '@heroicons/react/24/solid/PlayIcon';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { SeverityPill } from 'src/components/severity-pill';

export const ActionsTableBattles = (props) => {
    const { id, estado, user1 } = props;
    const router = useRouter();
    const auth = useAuth();
    const [retador, setRetador] = useState(auth.user.username === user1);

    const handleDuelo = async (decision) => {
        const res = await axiosAuth.patch(`/api/play/battles/${id}/decide`, {
            decision
        });
        if (res.status === 200) {
            decision ? router.push(`/battles/${id}`) : window.location.reload();
        }
    }

    if (retador && estado === 'En Creacion' || !retador && estado === 'Aceptado')
        return (
            <Tooltip title="Jugar duelo" >
                <IconButton
                    component={NextLink}
                    href={`/battles/${id}`}>
                    <SvgIcon fontSize="small">
                        <PlayIcon />
                    </SvgIcon>
                </IconButton>
            </Tooltip >
        );
    else if (!retador && estado === 'Pendiente')
        return (
            <>
                <Tooltip title="Aceptar duelo" >
                    <IconButton
                        onClick={() => handleDuelo(true)}
                    >
                        <SvgIcon fontSize="small">
                            <CheckCircleIcon style={{ color: 'green' }} />
                        </SvgIcon>

                    </IconButton>
                </Tooltip >
                <Tooltip title="Rechazar duelo" >
                    <IconButton
                        onClick={() => handleDuelo(false)}
                    >
                        <SvgIcon fontSize="small">
                            <CancelIcon style={{ color: 'red' }} />
                        </SvgIcon>

                    </IconButton>
                </Tooltip >
            </>
        );
    else return (
        <Tooltip title="Ver duelo" >
            <IconButton
                component={NextLink}
                href={`/battles/${id}`}>
                <SvgIcon fontSize="small">
                    <EyeIcon />
                </SvgIcon>
            </IconButton>
        </Tooltip >
    );
}

export const StateColor = (props) => {
    const { estado, user1, smallSize } = props;
    const auth = useAuth();
    const [retador, setRetador] = useState(auth.user.username === user1);

    const colors = {
        'En Creacion': 'success',
        'Pendiente': 'warning',
        'Aceptado': retador ? 'info' : 'success',
        'Finalizado': 'error',
    }

    const text = {
        'En Creacion': 'su turno',
        'Pendiente': 'pendiente',
        'Aceptado': retador ? 'aceptado' : 'su turno',
        'Finalizado': 'finalizado',
    }

    return (
        <SeverityPill
            color={colors[estado]}
            smallSize={smallSize}
        >
            {text[estado]}
        </SeverityPill>
    );
};

export const Score = (props) => {
    const { estado, score1, score2, isUser1 } = props;

    const scores = {
        'En Creacion': '-:-',
        'Pendiente': isUser1 ? `${score1}:-` : '-:-',
        'Aceptado': isUser1 ? `${score1}:-` : '-:-',
        'Finalizado': `${score1}:${score2}`,
    }
        

    return (
        <Typography variant="h4" sx={{ textAlign: "center" }}>
            {scores[estado]}
        </Typography>
    );
    

};
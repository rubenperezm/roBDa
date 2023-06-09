import { useState, useEffect } from 'react';
import { format, addMinutes, differenceInSeconds } from 'date-fns';

import { Typography } from '@mui/material';

// Countdown component (mm:ss)
export const CountDown = ({ minutes, setFinished }) => {
    const [endTime, setEndTime] = useState(addMinutes(new Date(), minutes));
    const [remainingTime, setRemainingTime] = useState(minutes * 60);

    useEffect(() => {
        const timerId = setInterval(() => {
            const currentTime = new Date();
            const secondsLeft = differenceInSeconds(endTime, currentTime);

            if (secondsLeft < 0) {
                setFinished(true);
                clearInterval(timerId);
            } else {
                setRemainingTime(secondsLeft);
            }
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [endTime]);

    // función para formatear el tiempo restante en formato mm:ss
    const formatTime = (time) => {
        const formattedTime = format(new Date(time * 1000), 'mm:ss');
        return formattedTime;
    };

    return (
        <Typography variant="h6" style={{ color: 'red' }}>
            {formatTime(remainingTime)}
        </Typography>
    );
};
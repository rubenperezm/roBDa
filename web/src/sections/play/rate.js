import { Rating, Typography } from '@mui/material';

export const Rate = (props) => {
    const { rate, setRate, label } = props;

    return (
        <>
        <Typography component="legend">{label}</Typography>
        <Rating
            name="simple-controlled"
            value={rate}
            onChange={(event, newValue) => {
                setRate(newValue);
            }}
            size="large"
        />
        </>
    )

}
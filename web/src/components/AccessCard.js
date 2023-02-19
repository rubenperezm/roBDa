import Grid2 from '@mui/material/Unstable_Grid2';
import {Card, CardHeader} from '@mui/material';

/* AccessCard with props children and title */




const AccessCard = ({children, title}) => {
    return (
        /*Grid black*/


        <Grid2 container display="flex" justifyContent="center" alignItems="center" sx={{ height: '100vh'}}>
            <Grid2 item xs={12} sm={8} md={6} lg={4} xl={3}>
                <Card>
                    <CardHeader title={title} sx={{textAlign:"center"}}/>
                    {children}
                </Card>
            </Grid2>
        </Grid2>

    );
}

export default AccessCard;
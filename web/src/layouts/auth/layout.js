import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Box, Typography, Unstable_Grid2 as Grid, Card, CardContent } from '@mui/material';
import { Logo } from 'src/components/logo';


export const Layout = (props) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Grid
        container
        sx={{ 
          justifyContent:"center",
          alignItems:"center",
          height: "100vh"
        }}
      >
        <Grid
          lg={6}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Card>
            <CardContent>
            <Box
              sx={{
                p: 3,
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                width: '100%'
              }}
            >
            <Box
              component={NextLink}
              href="/"
              sx={{
                display: 'inline-flex',
                height: 48,
                width: 48
              }}
            >
              <Logo />
            </Box>
          </Box>
              {children}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node
};
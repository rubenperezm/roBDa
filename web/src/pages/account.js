import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import { AccountPassword } from 'src/sections/account/account-password';

const Page = () => (
  <>
    <Head>
      <title>
        Perfil | ROBDA
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Mi cuenta
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                lg={12}
              >
                <AccountProfileDetails />
              </Grid>
              <Grid
                lg={12}
              >
                <AccountPassword />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

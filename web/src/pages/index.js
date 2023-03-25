import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { WelcomeMessage } from 'src/sections/home/welcome-message';
import { HomeCard } from 'src/sections/home/home-card';
import { useAuth } from 'src/hooks/use-auth';
import { studentMenu, adminMenu } from 'src/sections/home/options-menu';

const Page = () => {
  const auth = useAuth();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(auth.user.is_staff === true ? adminMenu : studentMenu);
  }, []);
  return (
  <>
    <Head>
      <title>
        Inicio | ROBDA
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            lg={12}
          >
            <WelcomeMessage />
          </Grid>

          {options.map((item) => (
            <Grid
              item
              key={item.title}
              lg={6}
              xs={12}
            >
              <HomeCard
                description={item.description}
                image={item.image}
                title={item.title}
                to={item.to}
                buttonText={item.buttonText}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

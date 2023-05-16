import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { withAuthGuard } from 'src/hocs/with-auth-guard';
import Head from 'next/head';
import { Box } from '@mui/material';
import { TopNav } from './top-nav';

const LayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
}));

const LayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%'
});

export const Layout = withAuthGuard((props) => {
    const { children, title } = props;
    const pathname = usePathname();
    const [openNav, setOpenNav] = useState(false);

    const handlePathnameChange = useCallback(
        () => {
            if (openNav) {
                setOpenNav(false);
            }
        },
        [openNav]
    );

    useEffect(
        () => {
            handlePathnameChange();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pathname]
    );

    return (
        <>
            <TopNav title={title} color="#111927"/>
            <LayoutRoot>
                <LayoutContainer>
                    <Head>
                        <title>
                            {title} | ROBDA
                        </title>
                    </Head>
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            py: 2,
                        }}
                    >
                        {children}
                    </Box>
                </LayoutContainer>
            </LayoutRoot>
        </>
    );
});

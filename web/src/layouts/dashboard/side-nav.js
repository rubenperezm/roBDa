import NextLink from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useAuth } from 'src/hooks/use-auth';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import AcademicCapIcon from '@heroicons/react/24/solid/AcademicCapIcon';
import ArrowLeftOnRectangleIcon from '@heroicons/react/24/solid/ArrowLeftOnRectangleIcon';
import {
  Box,
  Button,
  ButtonBase,
  Divider,
  Drawer,
  IconButton,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { studentItems, adminItems } from './config';
import { SideNavItem } from './side-nav-item';

export const SideNav = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const auth = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(auth.user.is_staff === true ? adminItems : studentItems);
  }, []);

  const LogOutIcon = (
    <SvgIcon fontSize="small">
      <ArrowLeftOnRectangleIcon />
    </SvgIcon>
  );

  const handleSignOut = useCallback(
    () => {
      auth.signOut();
      router.push('/auth/login');
    },
    [auth, router]
  );


  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: 'inline-flex',
              height: 32,
              width: 32
            }}
          >
            <Logo />
          </Box>

          <Box
            component={NextLink}
            href="/account"
            sx={{
              textDecoration: 'none',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
              p: '12px'
            }}
          >
            <div>
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
              >
                <Tooltip sx={{ color: "common.white" }}>
                  <SvgIcon fontSize="medium">
                    {(auth.user && auth.user.is_staff) ? <AcademicCapIcon /> : <UserIcon />}
                  </SvgIcon>
                </Tooltip>
                <Typography
                  color="common.white"
                  variant="subtitle1"
                >
                  {auth.user && auth.user.username}
                </Typography>
              </Stack>
            </div>
            <SvgIcon
              fontSize="small"
              sx={{ color: 'neutral.500' }}
            >
            </SvgIcon>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {items.map((item) => {
              const active = item.path ? (pathname === item.path) : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}

            {/* DIVIDER AND SIDENAVITEM WITH LOGOUT */}
            <Divider sx={{ borderColor: 'neutral.700' }} />

            <li>
              <ButtonBase
                onClick={handleSignOut}
                sx={{
                  alignItems: 'center',
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  pl: '16px',
                  pr: '16px',
                  py: '6px',
                  textAlign: 'left',
                  width: '100%',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)'
                  }
                }}
              >
                <Box
                  component="span"
                  sx={{
                    alignItems: 'center',
                    color: 'neutral.400',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  {LogOutIcon}
                </Box>
                <Box
                  component="span"
                  sx={{
                    color: 'neutral.400',
                    flexGrow: 1,
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: '24px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Cerrar sesión
                </Box>
              </ButtonBase>
            </li>
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 250
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
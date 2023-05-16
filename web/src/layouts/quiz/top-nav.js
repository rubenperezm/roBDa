import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';


export const TopNav = (props) => {
  const { color, title } = props;
  return (
      <Box
        component="header"
        sx={{
          backgroundColor: color,
          top: 0,
          width: '100%',
          textAlign: 'center',
          padding: 2,
        }}
      >
        <Typography variant="h4" color="#eef0f2">
          {title.toUpperCase()}
        </Typography>
      </Box>
  );
};

TopNav.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string
};

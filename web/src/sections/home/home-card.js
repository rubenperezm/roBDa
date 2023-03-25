import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

export const HomeCard = ({ title, description, image, to, buttonText }) => (
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={image}
          sx={{
            height: 100,
            mb: 2,
            width: 100
          }}
        />
        <Typography
          gutterBottom
          variant="h5"
        >
          {title}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {description}
        </Typography>
      </Box>
    </CardContent>
    <Divider />
    <CardActions
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column'
      }}>

        <Button
          component={NextLink}
          fullWidth
          variant="text"
          href={to}
        >
          {buttonText}
        </Button>

    </CardActions>
  </Card>
);

import React from 'react';
import { Link as RouterLink, NavLink, useHistory } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/system';
import AllAPI from '../utils/AllAPI';
import { useSnackbar } from 'notistack';

const Great = styled(Typography)(({ theme }) => ({
  fontSize: '19pt',
  color: 'black',
  flexGrow: 1,
}));

const NavigationLink = styled(Button)(({ theme }) => ({
  color: 'black',
}));

const NaviBar = () => {
  const history = useHistory();
  const tempAPI = new AllAPI();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const marginBottomStyle = {
    marginBottom: theme.spacing(2),
  };

  // the func used for logging out
  const logOut = async () => {
    try {
      const token = localStorage.getItem('token');
      localStorage.removeItem('token');
      history.push('/');
      enqueueSnackbar('Logged out', { variant: 'success', autoHideDuration: 3000 });

      const response = await tempAPI.postAPIRequestToken('admin/auth/logout', token)
      const tempData = await response.json();
      if (!response.ok) {
        console.warn(tempData.message);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  return (
    <AppBar position="static" color="default" sx={marginBottomStyle}>
      <Toolbar>
        <Great
          id="bigbrain-title"
          variant="h6"
          component={RouterLink}
          to="/dashboard"
          spacing={1}
        >
          BigBrain
        </Great>

        <NavigationLink
          id="bigbrain-dashboard"
          component={NavLink}
          to="/dashboard"
        >
          Dashboard
        </NavigationLink>

        <NavigationLink
          component={NavLink}
          id="bigbrain-logout"
          exact
          to="/"
          onClick={(event) => {
            event.preventDefault();
            logOut();
          }}
        >
          Log Out
        </NavigationLink>
      </Toolbar>
    </AppBar>
  );
};

export default NaviBar;

import { React, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import queryString from 'query-string';
import { useSnackbar } from 'notistack';
import AllAPI from '../utils/AllAPI';

const ContainerJoin = styled(Container)(() => ({
  backgroundColor: 'pink',
  padding: 0,
}));

const JoinText = styled(Typography)(({ theme }) => ({
  fontWeight: 610,
  color: 'purple',
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
  },
}));

const JoinComponent = styled(Grid)(() => ({
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100vh',
  alignItems: 'center',
}));

const PageJoin = () => {
  const [currSessionId, setCurrSessionId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const location = useLocation();
  const tempAPI = new AllAPI();
  const enqueueErrorSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: 3000 });
  };
  const handleSessionJoin = async () => {
    const errors = [];
    if (!playerName) errors.push('Name cannot be empty');
    if (playerName.length >= 24) errors.push('Name length cannot exceed 24 characters');
    if (!currSessionId) errors.push('Session id cannot be empty');
    if (errors.length) {
      errors.forEach(error => enqueueErrorSnackbar(error));
      return;
    }
    const body = {
      name: playerName,
    };

    try {
      const res = await tempAPI.postAPIRequestBody(`play/join/${currSessionId}`, body);
      const data = await res.json();
      if (res.ok) {
        history.push({
          pathname: `/play/${currSessionId}`,
          state: { playerId: data.playerId, playerName },
        });
      } else {
        enqueueErrorSnackbar('Invalid session ID');
      }
    } catch (error) {
      enqueueErrorSnackbar('There was a problem');
      console.warn(error);
    }
  };

  useEffect(() => {
    const temp = queryString.parse(location.search);
    temp.game && setCurrSessionId(temp.game);
  }, [location.search]);

  return (
    <ContainerJoin>
      <JoinComponent container>
        <Grid item xs={12} sm={8} md={6}>
          <form
            onSubmit={(e) => e.preventDefault()}
          >
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12}>
                <JoinText
                  variant="h2"
                  align="center"
                  gutterBottom
                >
                  BigBrain
                </JoinText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="large"
                  label="Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="large"
                  label="Session ID"
                  value={currSessionId}
                  onChange={(e) => setCurrSessionId(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={handleSessionJoin}
                >
                  Join Game
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </JoinComponent>
    </ContainerJoin>
  );
};

export default PageJoin;

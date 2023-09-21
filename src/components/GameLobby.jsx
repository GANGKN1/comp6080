import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router';

const GameLobby = () => {
  const { sessionId } = useParams();

  return (
    <Container maxWidth={false}>
      <Container
        maxWidth={false}
        sx={{ backgroundColor: 'pink', paddingBottom: '32px' }}
      >
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ padding: '16px', backgroundColor: 'white' }}>
              The Lobby ID is:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h1" sx={{ justifyContent: 'center"', padding: '32px', backgroundColor: 'white' }}>
              {sessionId}
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={12}>
                <Typography
                  variant="h2"
                  sx={{ padding: '32px', backgroundColor: 'white' }}
                >
                  Waiting for other players...
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

export default GameLobby;

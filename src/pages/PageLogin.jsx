import { React, useState } from 'react';
import AllAPI from '../utils/AllAPI';
import { Link, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Container, Box, Grid, TextField, Button, Typography, Link as MuiLink } from '@mui/material';

const PageLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const tempAPI = new AllAPI();
  const enqueueErrorSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: 3000 });
  };
  const enqueueSuccessSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'success', autoHideDuration: 3000 });
  };

  // func to upload the login form details
  const loginFormPoster = async () => {
    // the case the email is empty
    if (!email) {
      enqueueErrorSnackbar('Email cannot be empty');
      return;
    }
    // the case the password is empty
    if (!password) {
      enqueueErrorSnackbar('Password cannot be empty');
      return;
    }
    // set the request body
    const body = {
      email,
      password
    };

    try {
      const request = await tempAPI.postAPIRequestBody('admin/auth/login', body);
      const userData = await request.json();
      if (request.ok) {
        enqueueSuccessSnackbar('Successfully logged in');
        localStorage.setItem('token', userData.token);
        history.push('/dashboard');
      } else {
        // the case the info not right
        enqueueErrorSnackbar('Information not match');
      }
    } catch (error) {
      // gonna pop a alert
      enqueueErrorSnackbar('There was an error');
      console.warn(error);
    }
  };

  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
    >
      <Container>
        <Box>
          <Box>
            <Grid container direction="column" alignItems="center" justifyContent="center" spacing={1}>
              <Typography variant="h1" align="center">
                BigBrain
              </Typography>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type="email"
                  placeholder="Email"
                  onChange={(event) => setEmail(event.target.value)}
                  sx={{
                    minWidth: 400,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '5px',
                    },
                    '& .MuiOutlinedInput-input': {
                      paddingTop: '10px',
                      paddingBottom: '10px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type="password"
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                  sx={{
                    minWidth: 400,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '5px',
                    },
                    '& .MuiOutlinedInput-input': {
                      paddingTop: '10px',
                      paddingBottom: '10px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box textAlign="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => {
                      event.preventDefault();
                      loginFormPoster();
                    }}
                    sx={{
                      minWidth: 300, // Increase input width
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '5px',
                      },
                      '& .MuiOutlinedInput-input': {
                        paddingTop: '10px', // Decrease input height
                        paddingBottom: '10px', // Decrease input height
                      },
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box textAlign="center">
                  <MuiLink component={Link} to="/register" color="primary">
                    Go Register!
                  </MuiLink>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default PageLogin

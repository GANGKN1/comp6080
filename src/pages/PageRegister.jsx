import { React, useState } from 'react';
import AllAPI from '../utils/AllAPI';
import { Link, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Container, Box, Grid, TextField, Button, Typography, Link as MuiLink } from '@mui/material';

const PageRegister = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const tempAPI = new AllAPI();

  const enqueueErrorSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: 3000 });
  };
  const enqueueSuccessSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'success', autoHideDuration: 3000 });
  };

  const regiFormPoster = async () => {
    const errors = [];
    // the case email is empty
    if (!email) errors.push('Email cannot be empty');
    // the case name is empty
    if (!name) errors.push('Name cannot be empty');
    // the case password is empty
    if (!password || !repassword) errors.push('Password cannot be empty');
    // the case password not match
    if (password !== repassword) errors.push('Two password not match');
    if (errors.length) {
      errors.forEach(error => enqueueErrorSnackbar(error));
      return;
    }
    // set the request body content
    const body = {
      email,
      password,
      name
    };

    try {
      const res = await tempAPI.postAPIRequestBody('admin/auth/register', body);
      const data = await res.json();
      if (res.ok) {
        enqueueSuccessSnackbar('Successfully signed up');
        localStorage.setItem('token', data.token);
        history.push('/dashboard');
      } else {
        enqueueErrorSnackbar('Email has been used');
      }
    } catch (e) {
      enqueueErrorSnackbar('There was an error');
      console.warn(e);
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
      <Container maxWidth="sm">
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
                  type="name"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    minWidth: 400, // Increase input width
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '5px',
                    },
                    '& .MuiOutlinedInput-input': {
                      paddingTop: '10px', // Decrease input height
                      paddingBottom: '10px', // Decrease input height
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    minWidth: 400, // Increase input width
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '5px',
                    },
                    '& .MuiOutlinedInput-input': {
                      paddingTop: '10px', // Decrease input height
                      paddingBottom: '10px', // Decrease input height
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
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    minWidth: 400, // Increase input width
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '5px',
                    },
                    '& .MuiOutlinedInput-input': {
                      paddingTop: '10px', // Decrease input height
                      paddingBottom: '10px', // Decrease input height
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
                  placeholder="Retype Password"
                  onChange={(e) => setRePassword(e.target.value)}
                  sx={{
                    minWidth: 400, // Increase input width
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '5px',
                    },
                    '& .MuiOutlinedInput-input': {
                      paddingTop: '10px', // Decrease input height
                      paddingBottom: '10px', // Decrease input height
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box textAlign="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      regiFormPoster();
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
                    Register
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box textAlign="center">
                  <MuiLink component={Link} to="/" color="primary">
                    Go Login!
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

export default PageRegister;

import React from 'react'
import { useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const PagePlayerResult = () => {
  const currLocation = useLocation();
  const playerData = currLocation.state?.playerData;

  return (
    <Box sx={{ backgroundColor: 'primary', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth='md'>
        <Card>
          <CardHeader
            title={
              <Typography variant="h2" component="h2" sx={{ fontFamily: 'Montserrat', fontWeight: 500 }}>
                Well done, {playerData.name}!
              </Typography>
            }
            sx={{ backgroundColor: '#fff' }}
          />
          <CardContent sx={{ backgroundColor: '#f1f1f1' }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h3" component="h3" sx={{ fontFamily: 'Montserrat', fontWeight: 400 }}>
                  You got {playerData.correctQ} out of {playerData.maxQ} questions correct!
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3" component="h3" sx={{ fontFamily: 'Montserrat', fontWeight: 400 }}>
                  You scored {playerData.point} / {playerData.maxPoint} points!
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default PagePlayerResult

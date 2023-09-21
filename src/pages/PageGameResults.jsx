import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import NaviBar from '../components/NaviBar';
import AllAPI from '../utils/AllAPI';
import { useSnackbar } from 'notistack';
import {
  Container,
  Box,
  Grid,
  Typography,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import moment from 'moment';

const PageGameResult = () => {
  const { sessionId } = useParams();
  const [results, setResults] = useState([])
  const [dataForChart, setDataForChart] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const resultLoader = async () => {
      try {
        const token = localStorage.getItem('token');
        const tempAPI = new AllAPI();
        const response = await tempAPI.getAPIRequestToken(`admin/session/${sessionId}/results`, token);
        const tempData = await response.json();

        if (response.ok) {
          setResults(tempData.results);
          const numberOfPlayers = tempData.results.length;
          if (numberOfPlayers) {
            const dataOfChartGraph = tempData.results[0].answers.map((_, i) => {
              const numberOfCorrectAnswers = tempData.results.filter(result => result.answers[i].correct === true).length;
              const perOfCorrect = (numberOfCorrectAnswers / numberOfPlayers) * 100;

              const timeSpent = tempData.results.map(result => {
                const timeBegin = moment(result.answers[i].questionStartedAt);
                const timeEnding = moment(result.answers[i].answeredAt);
                return !isNaN(timeBegin) && timeBegin && !isNaN(timeEnding) && timeEnding
                  ? timeEnding.diff(timeBegin, 'milliseconds') / 1000
                  : 0;
              });

              const timeSpentSum = timeSpent.reduce((sum, time) => sum + time, 0);
              const averTimeSpentSum = timeSpentSum / timeSpent.length;

              return {
                question: `Q ${i + 1}`,
                'Correct Percent': perOfCorrect,
                'Average Time Spent (s)': averTimeSpentSum,
              };
            });
            setDataForChart(dataOfChartGraph);
          }
        }
      } catch (error) {
        enqueueSnackbar('An error occured', { variant: 'error', autoHideDuration: 3000 });
        console.warn(error);
      }
    };
    resultLoader();
  }, []);

  const renderResults = () => {
    if (!results) return null;
    return results.slice(0, 5).map((result, key) => (
      <Container key={key}>
        <CardContent>
          <Typography variant="h5">
            {key + 1}. {result.name}
          </Typography>
        </CardContent>
      </Container>
    ));
  };

  return (
    <>
      <NaviBar />
      <Container maxWidth="md">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h3" align="center">
              Game Result
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderResults()}
          </Grid>
        </Grid>
        <Box mt={3}>
          <ResponsiveContainer width="99%" aspect={3}>
            <BarChart data={dataForChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis yAxisId="left" orientation="left" stroke="#0069c0" />
              <YAxis yAxisId="right" orientation="right" stroke="#00a9b5" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="Correct Percent" fill="#0069c0" />
              <Bar yAxisId="right" dataKey="Average Time Spent (s)" fill="#00a9b5" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Container>
    </>
  );
};

export default PageGameResult;

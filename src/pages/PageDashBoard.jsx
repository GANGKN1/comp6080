import React, { useCallback, useState, useEffect } from 'react';
import { Grid, Card, CardHeader, Box, CardMedia, CardContent, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import ALLAPI from '../utils/AllAPI';
import { useSnackbar } from 'notistack';
import NaviBar from '../components/NaviBar';
import { useTheme } from '@mui/system';

import GameCreator from '../components/GameCreator';
import QuizDelBtn from '../components/QuizDelBtn';
import QuizStarter from '../components/QuizStarter';
import GameStarter from '../components/GameStarter';
import QuizStopper from '../components/QuizStopper';
import GameStopper from '../components/GameStopper';
import GameHistory from '../components/GameHistory';
import GameThumbnail from '../assets/avatar.png';

const PageDashBoard = () => {
  const [allGames, setAllGames] = useState([]);
  const [createBtn, setCreateBtn] = useState(false);
  const [startBtn, setStartBtn] = useState(false);
  const [stopBtn, setStopBtn] = useState(false);
  const [currentSessId, setCurrentSessId] = useState(0);
  const [currentGameId, setCurrentGameId] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const marginBottomStyle = {
    marginBottom: theme.spacing(2),
  };
  const marginLeftStyle = {
    marginLeft: theme.spacing(0.1),
  };

  // set some func for controlling btns display
  const CreateDisplayHandler = () => setCreateBtn(true);
  const CreateHideHandler = () => setCreateBtn(false);
  const StopBtnCloser = () => setStopBtn(false);
  const StartBtnCloser = () => setStartBtn(false);

  const StopBtnShower = useCallback(
    (id) => {
      setCurrentSessId(id);
      setStopBtn(true);
    },
    []
  );

  const StartBtnShower = useCallback(
    (gameId, sessionId) => {
      setCurrentSessId(sessionId);
      setCurrentGameId(gameId);
      setStartBtn(true);
    },
    []
  );

  // func to calculate the time spent
  const spendTimeCalculator = (entireQuiz) => {
    return entireQuiz.reduce((prev, current) => {
      return prev + current.time_limit;
    }, 0)
  }

  useEffect(() => {
    let isMounted = true;

    const enqueueErrorSnackbar = (message) => {
      enqueueSnackbar(message, { variant: 'error', autoHideDuration: 3000 });
    };

    const loadQuizData = async (quiz, tempAPI, token) => {
      try {
        const response = await tempAPI.getAPIRequestToken(`admin/quiz/${quiz.id}`, token);
        const quizData = await response.json();
        if (isMounted) {
          const newGame = { ...quizData, ...quiz };
          setAllGames((allGames) => [...allGames, newGame]);
        }
      } catch (error) {
        enqueueErrorSnackbar('Cannot get quizzes');
        console.warn(error);
      }
    };

    const gameLoader = async () => {
      try {
        const token = localStorage.getItem('token');
        const tempAPI = new ALLAPI();
        const response = await tempAPI.getAPIRequestToken('admin/quiz', token);

        if (response.status === 403) {
          enqueueErrorSnackbar('Invalid Token');
        } else if (response.status === 200) {
          const quizzes = await response.json();
          quizzes.quizzes.forEach((quiz) => loadQuizData(quiz, tempAPI, token));
        }
      } catch (error) {
        enqueueErrorSnackbar('Cannot get quizzes');
        console.warn(error);
      }
    };

    gameLoader();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <NaviBar />
      <Container>
        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={marginBottomStyle}>
          <Grid item xs={12} className="text-center">
            <Box m={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => CreateDisplayHandler()}
              >
                Click to create your own game
              </Button>
            </Box>
          </Grid>
          {allGames.map((game, key) => (
            <Grid item key={key} xs={12} sm={6} md={6} lg={4} className="mt-4">
              <Card>
                <CardHeader
                  title={game.name}
                  action={
                    game.active && (
                      <Button
                        onClick={() => { StartBtnShower(game.id, game.active) }}
                      >
                        Invite
                      </Button>
                    )
                  }
                />
                <CardMedia
                  component="img"
                  height="200"
                  image={game.thumbnail || GameThumbnail}
                  alt="Thumbnail"
                />
                <CardContent>
                  <Grid container justifyContent="space-between" alignItems="center" sx={marginBottomStyle}>
                    <Grid item xs={6}>
                      {game.questions.length} questions in total
                    </Grid>
                    <Grid item xs={6} sx={marginLeftStyle}>
                      {spendTimeCalculator(game.questions)} seconds limit
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item xs={4} sx={marginBottomStyle}>
                      {game.active
                        ? <QuizStopper
                            game={game}
                            setAllGames={setAllGames}
                            StopBtnShower={StopBtnShower}
                            id={game.active}
                          />
                        : <QuizStarter
                            game={game}
                            setAllGames={setAllGames}
                          />}
                    </Grid>
                    <Grid item xs={6} sx={marginBottomStyle}>
                      <Link to={`/edit/${game.id}`}>
                        <Button variant="contained" color="primary">
                          Edit Quiz
                        </Button>
                      </Link>
                    </Grid>
                    <Grid item xs={8} sx={marginBottomStyle}>
                      <QuizDelBtn
                        allGames={allGames}
                        setAllGames={setAllGames}
                        gameId={game.id}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <GameHistory
                        gameId={game.id}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <GameCreator
        setShow={setCreateBtn}
        show={createBtn}
        handleShow={CreateDisplayHandler}
        handleClose={CreateHideHandler}
        allGames={allGames}
        setAllGames={setAllGames}
      />
      <GameStarter
        show={startBtn}
        handleClose={StartBtnCloser}
        sessionId={currentSessId}
        gameId={currentGameId}
        StopBtnShower={StopBtnShower}
        setAllGames={setAllGames}
      />
      <GameStopper
        show={stopBtn}
        handleClose={StopBtnCloser}
        id={currentSessId}
      />
    </>
  )
}

export default PageDashBoard;

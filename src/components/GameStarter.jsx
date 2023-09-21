import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import AllAPI from '../utils/AllAPI';
import { TabOpener } from '../utils/TabOpener';

const GameStarter = ({
  show,
  handleClose,
  sessionId,
  gameId,
  StopBtnShower,
  setAllGames,
}) => {
  // set the custom hooks
  const [currPosition, setCurrPosition] = useState(-1);
  const [allPosition, setAllPosition] = useState(0);
  const [polling, setPolling] = useState(0);
  const [allPlayers, setAllPlayers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  // add some custom funcs
  const enqueueErrorSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: 3000 });
  };
  const enqueueSuccessSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'success', autoHideDuration: 3000 });
  };

  const copybeHavorHandler = (text) => {
    navigator.clipboard.writeText(text);
    enqueueSuccessSnackbar('Successfully copied ID to clipboard');
  }

  // the func used for upload file
  const posUpdator = async () => {
    const token = localStorage.getItem('token');
    const tempAPI = new AllAPI();

    try {
      const response = await tempAPI.getAPIRequestToken(`admin/session/${sessionId}/status`, token);
      const tempData = await response.json();
      if (response.ok) {
        if (currPosition < allPosition) {
          setCurrPosition(tempData.results.position + 1);
        } else {
          setCurrPosition(-1);
        }
        setAllPosition(tempData.results.questions.length)
      } else {
        enqueueErrorSnackbar('There was a problem');
      }
    } catch (error) {
      // there post the error
      enqueueErrorSnackbar('There was a problem');
      console.warn(error);
    }
  }

  const handleAdvance = useCallback(async () => {
    const token = localStorage.getItem('token');
    const tempAPI = new AllAPI();
    try {
      const response = await tempAPI.postAPIRequestToken(`admin/quiz/${gameId}/advance`, token);
      if (response.ok) {
        await posUpdator();
        // the case successfully advance to next question
        enqueueSnackbar('Status advanced', { variant: 'success', autoHideDuration: 3000 });
        if (currPosition >= allPosition) {
          const tempData = await tempAPI.getAPIRequestToken('admin/quiz', token);
          if (tempData.status === 403) {
            enqueueErrorSnackbar('Invalid Token');
          } else if (tempData.status === 200) {
            const quizzes = await tempData.json();
            setAllGames([]);
            for (const quiz of quizzes.quizzes) {
              const quizDataResponse = await tempAPI.getAPIRequestToken(`admin/quiz/${quiz.id}`, token);
              const quizData = await quizDataResponse.json();
              const newGame = { ...quizData, ...quiz };
              setAllGames((allGames) => [...allGames, newGame]);
            }
          }
          setCurrPosition(-1);
          handleClose(true);
          StopBtnShower(sessionId);
        }
      } else if (response.status === 400) {
        handleClose(true);
        StopBtnShower(sessionId);
      } else {
        enqueueErrorSnackbar('Cant advance status');
      }
    } catch (error) {
      // there post the error
      enqueueErrorSnackbar('There was a problem');
      console.warn(error);
    }
  }, [currPosition, allPosition, gameId, sessionId, handleClose, StopBtnShower, posUpdator, enqueueErrorSnackbar, enqueueSnackbar]);

  useEffect(() => {
    let isMounted = true;
    const playersLoader = async () => {
      const token = localStorage.getItem('token');
      const tempAPI = new AllAPI();
      const response = await tempAPI.getAPIRequestToken(`admin/session/${sessionId}/status`, token);
      const tempData = await response.json();
      if (response.ok) {
        isMounted && setAllPlayers(tempData.results.players);
      } else {
        isMounted && setAllPlayers([]);
      }
    };

    sessionId !== 0 && playersLoader();
    polling >= 0 && setTimeout(() => isMounted && setPolling(polling + 1), 1000);
    return () => {
      isMounted = false;
    };
  }, [polling, sessionId]);

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <FormControl>
        <DialogTitle>Invite</DialogTitle>
        <DialogContent>
          <Typography sx={{ marginBottom: 1 }} id="session-id">
            The Session ID is
          </Typography>
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: {
                xs: '36pt',
                sm: '56pt',
              },
              marginBottom: 2,
            }}
          >
            {sessionId}
          </Typography>
          <Grid container justifyContent="center">
            <Button
              id="copy-to-clipboard"
              onClick={() => {
                copybeHavorHandler(sessionId);
              }}
              sx={{ my: 1 }}
            >
              Copy The Session ID To Clipboard
            </Button>
          </Grid>
          <Grid container justifyContent="center">
            <Button
              id="btn-to-join"
              onClick={() =>
                TabOpener(`${window.location.origin}/join?game=${sessionId}`)
              }
              sx={{ my: 1 }}
            >
              Click to Join The Game
            </Button>
          </Grid>
          <hr />
          <Grid container>
            <Grid item xs={12}>
              <Grid container justifyContent="center">
                {currPosition > -1 && (
                  <Typography className="mb-1">
                    Question {currPosition}/{allPosition}
                  </Typography>
                )}
              </Grid>
              <Grid container justifyContent="center">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    handleAdvance();
                  }}
                >
                  {currPosition === -1 ? 'Start Game' : 'Next Question'}
                </Button>
              </Grid>
              <hr />
              <Typography variant="h5" align="center" gutterBottom>
                Players Joined
              </Typography>
              <Grid container justifyContent="center">
                {allPlayers.map((playerList, key) => (
                  <Grid
                    item
                    xs={12}
                    sm={5}
                    key={key}
                  >
                    <Typography
                      variant="body1"
                      align="center"
                    >
                      {playerList}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} id="btn-to-close">
            Close
          </Button>
        </DialogActions>
      </FormControl>
    </Dialog>
  );
};

GameStarter.propTypes = {
  StopBtnShower: PropTypes.func.isRequired,
  setAllGames: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  gameId: PropTypes.number.isRequired,
  sessionId: PropTypes.number.isRequired,
};
export default GameStarter;

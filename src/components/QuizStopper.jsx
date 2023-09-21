import React from 'react';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import AllAPI from '../utils/AllAPI';
import PropTypes from 'prop-types';

const QuizStopper = ({ game, setAllGames, StopBtnShower, id }) => {
  const { enqueueSnackbar } = useSnackbar();
  const enqueueErrorSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: 3000 });
  };
  const gameStopHandler = async () => {
    const token = localStorage.getItem('token');
    const tempAPI = new AllAPI();

    try {
      // send request to backend
      const tempData = await tempAPI.postAPIRequestToken(`admin/quiz/${game.id}/end`, token);
      if (tempData.ok) {
        enqueueSnackbar('Game Ended', { variant: 'success', autoHideDuration: 3000 });
        const gameData = await tempAPI.getAPIRequestToken('admin/quiz', token);

        if (gameData.status === 403) {
          enqueueErrorSnackbar('Invalid token');
        } else if (gameData.status === 200) {
          setAllGames([]);
          const { quizzes } = await gameData.json();

          quizzes.forEach(async (quiz) => {
            try {
              const response = await tempAPI.getAPIRequestToken(`admin/quiz/${quiz.id}`, token);
              const infoOfQuiz = await response.json();
              const tempGame = { ...infoOfQuiz, ...quiz };
              setAllGames((allGames) => [...allGames, tempGame]);
            } catch (error) {
              enqueueErrorSnackbar('There was a problem');
              console.warn(error);
            }
          });
        }
      } else if (tempData.status === 400) {
        enqueueErrorSnackbar('Game is active already');
      } else {
        enqueueErrorSnackbar('There was a problem');
      }
    } catch (error) {
      enqueueErrorSnackbar('There was a problem');
      console.warn(error);
    }
  };

  return (
    <Button
      fullWidth
      variant="contained"
      color="error"
      onClick={() => {
        gameStopHandler();
        StopBtnShower(id);
      }}
    >
      Stop
    </Button>
  );
};

QuizStopper.propTypes = {
  game: PropTypes.object.isRequired,
  setAllGames: PropTypes.func.isRequired,
  StopBtnShower: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
};

export default QuizStopper;

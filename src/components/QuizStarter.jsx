import React from 'react'
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import AllAPI from '../utils/AllAPI';
import PropTypes from 'prop-types'

const QuizStarter = ({ game, setAllGames }) => {
  const { enqueueSnackbar } = useSnackbar();
  const enqueueErrorSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: 3000 });
  };
  const gameStartHanldler = async () => {
    const token = localStorage.getItem('token');
    const tempAPI = new AllAPI();

    try {
      const response = await tempAPI.postAPIRequestToken(`admin/quiz/${game.id}/start`, token);
      if (response.ok) {
        enqueueSnackbar('Game Started', { variant: 'success', autoHideDuration: 3000 });
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
      } else {
        enqueueErrorSnackbar('There was a problem');
      }
    } catch (error) {
      enqueueErrorSnackbar('There was a problem');
      console.warn(error);
    }
  };

  return (
    <Button variant="contained" color="primary" fullWidth onClick={() => gameStartHanldler()}>
      Start
    </Button>
  )
}

QuizStarter.propTypes = {
  game: PropTypes.object.isRequired,
  setAllGames: PropTypes.func.isRequired
}

export default QuizStarter

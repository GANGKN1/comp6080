import React from 'react';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import AllAPI from '../utils/AllAPI';
import PropTypes from 'prop-types';

const QuizDelBtn = ({ allGames, setAllGames, gameId }) => {
  // func for alert
  const { enqueueSnackbar } = useSnackbar();

  const gameDeleter = async (id) => {
    const token = localStorage.getItem('token');
    const tempAPI = new AllAPI();
    try {
      const response = await tempAPI.deleteAPIRequestToken(`admin/quiz/${id}`, token);
      if (response.ok) {
        setAllGames(allGames.filter(game => game.id !== id))
        enqueueSnackbar('Successfully Removed Quiz', { variant: 'success', autoHideDuration: 3000 });
      } else {
        enqueueSnackbar('Unsuccessfully Remove Quiz', { variant: 'error', autoHideDuration: 3000 });
      }
    } catch (error) {
      enqueueSnackbar('There was a problem', { variant: 'error', autoHideDuration: 3000 });
      console.warn(error);
    }
  }

  return (
    <Button
      variant="contained"
      color="error"
      onClick={() => gameDeleter(gameId)}
    >
      Delete
    </Button>
  )
}

QuizDelBtn.propTypes = {
  allGames: PropTypes.array.isRequired,
  setAllGames: PropTypes.func.isRequired,
  gameId: PropTypes.number.isRequired
}

export default QuizDelBtn

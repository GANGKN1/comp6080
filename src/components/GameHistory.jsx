import React, { useState, useCallback } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import AllAPI from '../utils/AllAPI';
import { TabOpener } from '../utils/TabOpener';
import PropTypes from 'prop-types';

const GameHistory = ({ gameId }) => {
  const [gameHistory, setGameHistory] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // check if this quiz has game history
  const gameHistoryGetter = useCallback(async () => {
    const token = localStorage.getItem('token');
    const tempAPI = new AllAPI();
    try {
      const response = await tempAPI.getAPIRequestToken('admin/quiz', token);
      const tempData = await response.json();
      if (response.ok) {
        const tempQuiz = tempData.quizzes.find((quiz) => quiz.id === gameId);
        tempQuiz && setGameHistory(tempQuiz.oldSessions);
      }
    } catch (e) {
      enqueueSnackbar('Cannot get the history', { variant: 'error', autoHideDuration: 3000 });
      console.warn(e);
    }
  }, [gameId, enqueueSnackbar]);

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    await gameHistoryGetter();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button onClick={handleClick} variant="outlined">
        Game History
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {
          gameHistory && gameHistory.length !== 0
            ? (
                gameHistory.map((sessionId, key) => (
                  <MenuItem
                    key={key}
                    onClick={() => {
                      TabOpener(`${window.location.origin}/results/${sessionId}`);
                      handleClose();
                    }}
                  >
                    {`Game ${sessionId}`}
                  </MenuItem>
                ))
              )
            : (
                <MenuItem>
                  <Typography className="text-center mb-0">This quiz has no game history</Typography>
                </MenuItem>
              )
        }
      </Menu>
    </>
  );
};

GameHistory.propTypes = {
  gameId: PropTypes.number.isRequired
};

export default GameHistory;

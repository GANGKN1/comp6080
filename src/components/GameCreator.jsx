import React, { useState } from 'react';
import AllAPI from '../utils/AllAPI';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';

const GameCreator = ({ show, handleClose, setAllGames }) => {
  const [gameName, setGameName] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const enqueueErrorSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: 3000 });
  };

  const enqueueSuccessSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'success', autoHideDuration: 3000 });
  };

  const gameUploader = async (quiz) => {
    try {
      const token = localStorage.getItem('token');
      const tempAPI = new AllAPI();
      // use the typed quiz name as new quiz name
      const response = await tempAPI.postAPIRequestBodyToken('admin/quiz/new', { name: quiz.name }, token);
      const tempData = await response.json();
      if (response.ok) {
        try {
          // set the new quiz id
          const tempQuizId = quiz;
          tempQuizId.id = tempData.quizId;
          // send the quest to backend
          await tempAPI.putAPIRequestTokenBody(`admin/quiz/${tempData.quizId}`, tempQuizId, token);
          enqueueErrorSnackbar('Created successfully!');
          tempAPI.getAPIRequestToken('admin/quiz', token).then((response) => {
            if (response.status === 403) {
              // the case token is invalid
              enqueueErrorSnackbar('Invalid Token');
            } else if (response.status === 200) {
              setAllGames([]);
              response.json().then((quizzes) => {
                quizzes.quizzes.forEach((quiz) => {
                  tempAPI.getAPIRequestToken(`admin/quiz/${quiz.id}`, token).then((response) => {
                    response.json().then((quizData) => {
                      const newGame = { ...quizData, ...quiz }
                      setAllGames(allGames => [...allGames, newGame]);
                    })
                  }).catch((error) => {
                    // there post the possible error
                    enqueueErrorSnackbar('A problem occurs');
                    console.warn(error)
                  })
                })
              })
            }
          }).catch((error) => {
            // there post the possible error
            enqueueErrorSnackbar('A problem occurs');
            console.warn(error)
          })
        } catch (error) {
          // there post the possible error
          enqueueErrorSnackbar('A problem occurs');
          console.warn(error);
        }
      } else {
        enqueueErrorSnackbar('format not supported');
      }
    } catch (error) {
      // there post the possible error
      console.warn(error);
    }
  }

  const gameUploaderHandler = (event) => {
    const f = event.target.files[0];
    // make sure the file input exist
    if (f) {
      const tempfile = f.name.substring(f.name.lastIndexOf('.') + 1);

      // check the type of the file
      if (tempfile === 'json') {
        const fr = new FileReader();
        fr.readAsText(event.target.files[0], 'UTF-8');
        fr.onload = (event) => {
          const tempGame = JSON.parse(event.target.result);
          gameUploader(tempGame);
          handleClose();
        };
      } else {
        enqueueErrorSnackbar('format not supported');
      }
    }
  }

  const FileInputLabel = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
  }));

  const HiddenFileInput = styled('input')({
    display: 'none',
  });

  const gameCreateHandler = async (event) => {
    event.preventDefault()
    if (!gameName) {
      enqueueErrorSnackbar('Need input a quiz name');
      return;
    }
    // set the request body
    const body = {
      name: gameName,
    };

    try {
      const token = localStorage.getItem('token');
      const tempAPI = new AllAPI();

      // add a new game
      const response = await tempAPI.postAPIRequestBodyToken('admin/quiz/new', body, token);
      if (response.ok) {
        handleClose();
        enqueueSuccessSnackbar('Created successfully!');

        tempAPI.getAPIRequestToken('admin/quiz', token).then((response) => {
          if (response.status === 403) {
            // the case the token is invalid
            enqueueErrorSnackbar('Invalid Token');
          } else if (response.status === 200) {
            setAllGames([]);
            response.json().then((quizzes) => {
              quizzes.quizzes.forEach((quiz) => {
                tempAPI.getAPIRequestToken(`admin/quiz/${quiz.id}`, token).then((response) => {
                  response.json().then((quizData) => {
                    const newGame = { ...quizData, ...quiz }
                    setAllGames(allGames => [...allGames, newGame]);
                  })
                }).catch((error) => {
                  // there post the possible error
                  enqueueErrorSnackbar('A problem occurs');
                  console.warn(error)
                })
              })
            })
          }
        }).catch((error) => {
          // there post the possible error
          enqueueErrorSnackbar('A problem occurs');
          console.warn(error)
        })
      } else {
        enqueueErrorSnackbar('Cannot create quiz');
      }
    } catch (error) {
      // there post the possible error
      enqueueErrorSnackbar('A problem occurs');
      console.warn(error);
    }
  }

  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>Create Game</DialogTitle>
      <DialogContent>
        <TextField
          label="Game Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={gameName}
          onChange={(event) => setGameName(event.target.value)}
        />
        <Box>
          <label htmlFor="upload-quiz">
            <FileInputLabel component="div" variant="body1">
              Use exist quiz
            </FileInputLabel>
          </label>
          <HiddenFileInput
            type="file"
            accept=".json"
            onChange={(event) => gameUploaderHandler(event)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={(event) => {
            gameCreateHandler(event);
          }}
        >
          Create Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};

GameCreator.propTypes = {
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  setAllGames: PropTypes.func.isRequired
};

export default GameCreator;

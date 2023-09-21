import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import NaviBar from '../components/NaviBar';
import { Container, Grid, Card, CardContent, Button, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import AllAPI from '../utils/AllAPI';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';

const StyledImg = styled('img')`
  width: 100%;
  height: auto;
`;

const PageEditQuiz = () => {
  const { quizId } = useParams();
  const [quizInfo, setQuizInfo] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [quizImage, setQuizImage] = useState('');
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  // set some helper func for alert popping out
  const enqueueErrorSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: 3000 });
  };

  const enqueueSuccessSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'success', autoHideDuration: 3000 });
  };

  const marginBottomStyle = {
    marginBottom: theme.spacing(2),
  };

  const marginLeftStyle = {
    marginLeft: theme.spacing(2),
  };

  // set the conetent of a default question
  const defaultQuesAdder = () => {
    setQuestions(prevQuestion => {
      return [...prevQuestion,
        {
          id: uuidv4(),
          text: 'A New Question',
          time_limit: 10,
          type: 'single',
          point: 10,
          answers: [
            {
              id: -100,
              answerText: 'Kyle',
              check: true,
            },
            {
              id: -200,
              answerText: 'Liu',
              check: false,
            },
          ],
          thumbnail: null,
          video: null,
          correctAnswers: [-100]
        }]
    })
  }
  // func to remove a question in quiz
  const quesRemover = (qId) => {
    setQuestions(questions.filter(question => question.id !== qId))
  }

  // func to upload a image
  const imgUploader = async (event) => {
    const f = event.target.files[0];
    if (f) {
      const tempF = f.name.substring(f.name.lastIndexOf('.') + 1);

      if (tempF === 'jpg' || tempF === 'png' || tempF === 'jpeg') {
        const outputImage = await fileConvertor(f);
        setQuizImage(outputImage);
      } else {
        enqueueErrorSnackbar('File type unsupported');
      }
    }
  };

  // convert the file to ideal size
  const fileConvertor = (f) => {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.readAsDataURL(f);
      fr.onload = () => resolve(fr.result);
      fr.onerror = (e) => {
        enqueueErrorSnackbar('File could not be read');
        reject(e);
      };
    });
  };

  // func to remove the image of a quiz
  const imageRemover = async () => {
    setQuizImage(avatarImage);
  }

  // func to save the changes
  const changeSaver = async () => {
    const tempAPI = new AllAPI();
    const token = localStorage.getItem('token');
    const body = {
      questions,
      thumbnail: quizImage
    };

    try {
      const response = await tempAPI.putAPIRequestTokenBody(`admin/quiz/${quizId}`, body, token);
      if (!response.ok) {
        // the case fail
        enqueueErrorSnackbar('Changed failed');
      } else {
        // the case success
        enqueueSuccessSnackbar('Successfully changed');
      }
    } catch (error) {
      // gonna pop a alert
      enqueueErrorSnackbar('A problem occured');
      console.warn(error);
    }
  };

  // the func to automatically update
  const autoQuesSaver = async () => {
    const tempAPI = new AllAPI();
    const token = localStorage.getItem('token');
    const body = {
      questions,
      thumbnail: quizImage
    };

    try {
      const response = await tempAPI.putAPIRequestTokenBody(`admin/quiz/${quizId}`, body, token);
      if (!response.ok) {
        enqueueErrorSnackbar('Changed failed');
      }
    } catch (error) {
      enqueueErrorSnackbar('A problem occured');
      console.warn(error);
    }
  }

  // hook to set the thumbnail
  useEffect(() => {
    const tempAPI = new AllAPI();
    const token = localStorage.getItem('token');

    const quesLoader = async () => {
      try {
        const response = await tempAPI.getAPIRequestToken(`admin/quiz/${quizId}`, token);
        const data = await response.json();
        if (response.ok) {
          setQuizInfo(data);
          setQuizImage(data.thumbnail);
          setQuestions(data.questions);
        } else {
          enqueueErrorSnackbar('A problem occured');
        }
      } catch (error) {
        enqueueErrorSnackbar('A problem occured');
        console.warn(error);
      }
    }
    quesLoader()
  }, [])

  return (
    <>
      <NaviBar />
      <Container>
        <Grid container justifyContent="center" alignItems="center" sx={marginBottomStyle}>
          <Typography variant="h4">{quizInfo.name}</Typography>
        </Grid>

        <Grid container justifyContent="center" alignItems="center" sx={marginBottomStyle}>
          <Grid item xs={12} md={4}>
            <StyledImg src={quizImage || avatarImage} alt="Thumbnail" />
          </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center" sx={marginBottomStyle}>
          <input
            type="file"
            onChange={(event) => {
              imgUploader(event);
            }}
            accept={'.png, .jpeg, .jpg'}
          />
          <Button variant="contained" color="error" onClick={imageRemover}>
            Remove
          </Button>
        </Grid>

        <Grid container justifyContent="center" alignItems="center">
          {questions &&
            questions.map((question, index) => (
              <Grid key={index} item xs={12} md={8}>
                <Card sx={marginBottomStyle}>
                  <CardContent>
                    <Grid container>
                      <Grid item xs={9}>
                        <Typography variant="body1">
                          {index + 1}. {question.text}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Link to={{ pathname: `/editquestion/${quizId}/${question.id}`, state: { qObj: question } }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={autoQuesSaver}
                          >
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => quesRemover(question.id)}
                          sx={marginLeftStyle}
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        <Grid container justifyContent="center" alignItems="center" sx={marginBottomStyle}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={defaultQuesAdder}
            >
              Add New Question
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={changeSaver}
              sx={marginLeftStyle}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

PageEditQuiz.propTypes = {
  id: PropTypes.number.isRequired
}

export default PageEditQuiz

import React, { useState, useEffect } from 'react'
import NaviBar from '../components/NaviBar';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import AllAPI from '../utils/AllAPI';
import ReactPlayer from 'react-player';
import { useLocation, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Container, Grid, Card, CardMedia, Checkbox, ButtonGroup, CardContent, Button, Typography, TextField } from '@mui/material';
import { useTheme } from '@mui/system';

const PageEditQuestion = () => {
  // set some useful hooks
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState('');
  const [typeOfQuestion, setTypeOfQuestion] = useState('');
  const [quesPoints, setQuesPoints] = useState(0);
  const [quesAnswer, setQuesAnswer] = useState('');
  const [timeToAnswer, setTimeToAnswer] = useState(0);
  const [allAnswers, setAllAnswers] = useState([]);
  const [quesVideo, setQuesVideo] = useState();
  const [quesVideoURL, setQuesVideoURL] = useState('');
  const [quesAnswerId, setQuesAnswerId] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [height, setHeight] = useState(0);
  const [defaultQuesImg, setDefaultQuesImg] = useState('');
  const currlocation = useLocation();
  const qObj = currlocation.state?.qObj;
  const history = useHistory();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { id, qid } = useParams();
  const marginBottomStyle = {
    marginBottom: theme.spacing(2),
  };

  const setQuesTypeMulti = () => {
    setTypeOfQuestion('multiple')
  }
  const setQuesTypeSingle = () => {
    setTypeOfQuestion('single')
  }

  const enqueueErrorSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: 3000 });
  };

  const enqueueSuccessSnackbar = (message) => {
    enqueueSnackbar(message, { variant: 'success', autoHideDuration: 3000 });
  };

  // func to add new choice options
  const OptionAdder = () => {
    if (allAnswers.length >= 6) {
      enqueueErrorSnackbar('Maximum 6 options!');
      return;
    }
    setQuesAnswerId(quesAnswerId + 1);
    setAllAnswers(prevAnswer => [
      ...prevAnswer,
      { id: quesAnswerId, answerText: quesAnswer, check: false },
    ]);
  };

  // func to add video for question
  const quesVideoAdder = async () => {
    if (!quesVideoURL) return;
    setDefaultQuesImg('');
    setHeight(405);
    setQuesVideo(quesVideoURL);
  };

  // func to remove a exist answer choice
  const answerRemover = (aId) => {
    if (correctAnswers.includes(aId)) {
      const tempAnswers = correctAnswers;
      tempAnswers.splice(tempAnswers.indexOf(aId), 1);
      setCorrectAnswers([...tempAnswers]);
    }
    setAllAnswers(allAnswers.filter(ans => ans.id !== aId));
  };

  // func to upload image or video
  const fileUploader = async (event) => {
    const f = event.target.files[0];
    if (!f) return;
    const tempfile = f.name.substring(f.name.lastIndexOf('.') + 1);
    if (['jpg', 'jpeg', 'png'].includes(tempfile)) {
      const convertedfile = await fileConvertor(f);
      setHeight(0);
      setQuesVideo('');
      setDefaultQuesImg(convertedfile);
    } else if (['mp4', 'mov'].includes(tempfile)) {
      setHeight(405);
      setDefaultQuesImg('');
      setQuesVideo(URL.createObjectURL(f));
    } else {
      enqueueErrorSnackbar('File type unsupported');
    }
  };

  // func to display video
  const videoDisplayer = (video) => {
    if (!video) return;
    setHeight(405);
    setQuesVideo(video);
  }
  // func to convert file size
  const fileConvertor = (f) => {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.readAsDataURL(f);
      fr.onload = () => resolve(fr.result);
      fr.onerror = (error) => {
        enqueueErrorSnackbar('File could not be read');
        reject(error);
      };
    });
  };

  // answer modifier handler
  const correctAnswerModifier = (choice) => {
    const tempAnswers = [...correctAnswers];
    if (!tempAnswers.includes(choice.id)) {
      tempAnswers.push(choice.id);
    } else {
      tempAnswers.splice(tempAnswers.indexOf(choice.id), 1);
    }
    setCorrectAnswers(tempAnswers);

    const clone = [...allAnswers];
    const index = clone.findIndex(item => item.id === choice.id);
    clone[index].check = !clone[index].check;
    setAllAnswers(clone);
  }

  // answer modifier checker
  const changesChecker = async () => {
    const errors = [];
    if (isNaN(quesPoints)) errors.push('Input a number as points');
    if (isNaN(timeToAnswer)) errors.push('Input a number as time limit');
    if (allAnswers.length < 2) errors.push('At least 2 choices needed');
    if (typeOfQuestion === 'single' && correctAnswers.length !== 1) errors.push('question type not match');
    if (typeOfQuestion === 'multiple' && correctAnswers.length < 2) errors.push('question type not match');
    if (errors.length) {
      errors.forEach(error => enqueueErrorSnackbar(error));
      return;
    }
    enqueueSuccessSnackbar('Changes has been made');
    requestBodyCreater();
  };

  // func to create the request body
  const requestBodyCreater = () => {
    const requestBody = {
      id: qid,
      point: parseInt(quesPoints || qObj.point, 10),
      text: question || qObj.text,
      time_limit: parseInt(timeToAnswer || qObj.time_limit, 10),
      answers: allAnswers,
      type: typeOfQuestion,
      thumbnail: defaultQuesImg,
      video: quesVideo,
      correctAnswers
    };

    const index = questions.findIndex(question => question.id === qid);
    const clone = [...questions];
    clone[index] = requestBody;
    changesSaver(clone);
  };

  // func to automatically save changes
  const changesSaver = async (changedBody) => {
    const tempAPI = new AllAPI();
    const token = localStorage.getItem('token');
    const body = { questions: changedBody };

    try {
      const res = await tempAPI.putAPIRequestTokenBody(`admin/quiz/${id}`, body, token);
      if (res.ok) {
        history.push(`/edit/${id}`);
      } else {
        enqueueErrorSnackbar('There was a problem');
      }
    } catch (error) {
      enqueueErrorSnackbar('There was a problem');
      console.warn(error);
    }
  };

  useEffect(() => {
    const tempAPI = new AllAPI();
    const token = localStorage.getItem('token');
    const questionLoader = async () => {
      try {
        const res = await tempAPI.getAPIRequestToken(`admin/quiz/${id}`, token);
        const response = await res.json();
        if (res.ok) {
          setQuestions(response.questions);
          setQuestion(qObj.text);
          setQuesAnswerId(qObj.answers.length);
          setQuesPoints(qObj.point);
          setTypeOfQuestion(qObj.type);
          setAllAnswers(qObj.answers);
          setCorrectAnswers(qObj.correctAnswers);
          setTimeToAnswer(qObj.time_limit);
          videoDisplayer(qObj.video);
          setDefaultQuesImg(qObj.thumbnail);
        } else {
          enqueueErrorSnackbar('There was a problem');
          console.warn(response);
        }
      } catch (error) {
        enqueueErrorSnackbar('There was a problem');
        console.warn(error);
      }
    };
    questionLoader();
  }, []);

  return (
    <>
      <NaviBar />
      <Container>
        <Grid container justifyContent="center" alignItems="center" spacing={2} sx={marginBottomStyle}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              placeholder="Question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center" className={defaultQuesImg ? '' : 'd-none'}>
          <Grid item md={12}>
            <ReactPlayer
              url={quesVideo}
              height={height}
              loop={true}
              controls={true}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center" className={defaultQuesImg ? '' : 'd-none'}>
          <Grid item xs={12}>
            <CardMedia
              component="img"
              style={{ maxHeight: 400, maxWidth: 400 }}
              image={defaultQuesImg}
              alt='Thumbnail'
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center" sx={marginBottomStyle}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignItems="center" spacing={2}>
              <Grid item xs={12} sm={4}>
                <input
                  accept=".png, .jpeg, .jpg, .mov, .mp4"
                  type="file"
                  onChange={(event) => {
                    fileUploader(event);
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Input Video URL Here"
                  onChange={(event) => setQuesVideoURL(event.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Button variant="contained" color="primary" onClick={quesVideoAdder} fullWidth>
                  Preview Video
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container justifyContent="center" alignItems="center" spacing={2} sx={marginBottomStyle}>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              fullWidth
              label="Points for this question"
              placeholder="10"
              value={quesPoints}
              onChange={(event) => setQuesPoints(event.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              fullWidth
              label="Time Limit (seconds)"
              placeholder="20"
              value={timeToAnswer}
              onChange={(event) => setTimeToAnswer(event.target.value)}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center" sx={marginBottomStyle}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">Question Type: {typeOfQuestion.charAt(0).toUpperCase() + typeOfQuestion.slice(1)} Choice</Typography>
          </Grid>
        </Grid>

        <Grid container justifyContent="center" alignItems="center" sx={marginBottomStyle}>
          <ButtonGroup>
            <Button variant="primary" onClick={setQuesTypeSingle}>Single Choice</Button>
            <Button variant="primary" onClick={setQuesTypeMulti}>Multiple Choice</Button>
          </ButtonGroup>
        </Grid>

        <Grid container justifyContent="center" alignItems="center">
          {allAnswers &&
            allAnswers.map((ans, index) => (
              <Grid item xs={12} key={index} sx={marginBottomStyle}>
                <Card>
                  <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item md={10}>
                        <Typography variant="body1">
                          Tick if correct
                        </Typography>
                        <Checkbox
                          checked={ans.check}
                          onChange={() => correctAnswerModifier(ans)}
                        />
                        <Typography variant="h6" component="p">
                          {ans.answerText}
                        </Typography>
                      </Grid>
                      <Grid item md={2}>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => answerRemover(ans.id)}
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
        <Grid>
          <Grid container justifyContent="center" alignItems="center" sx={marginBottomStyle}>
            <Grid item xs={10}>
              <TextField
                placeholder="New Answer"
                onChange={(event) => setQuesAnswer(event.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" onClick={OptionAdder}>Add choice</Button>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" alignItems="center">
            <Button variant="contained" onClick={changesChecker}>Save</Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

PageEditQuestion.propTypes = {
  id: PropTypes.number.isRequired,
  qid: PropTypes.string.isRequired
}

export default PageEditQuestion;

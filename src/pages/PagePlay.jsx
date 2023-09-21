import { React, useEffect, useState } from 'react';
import AllAPI from '../utils/AllAPI';
import ReactPlayer from 'react-player';
import GameLobby from '../components/GameLobby';
import { styled } from '@mui/system';
import { useHistory, useLocation } from 'react-router';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Checkbox,
  CardMedia,
} from '@mui/material';

const QuestionDiscription = styled('p')`
  font-size: 28pt;
  color: black;
`

const PagePlay = () => {
  // some useful hook for setting status
  const currlocation = useLocation();
  // hook for setting the question discription
  const [questionDiscription, setQuestionDiscription] = useState('');
  // hook for setting the question type
  const [typeOfQuestion, setTypeOfQuestion] = useState('');
  // hook for setting the question choices
  const [choices, setChoices] = useState([]);
  // hook for setting the question answers
  const [answerList, setAnswerList] = useState([]);
  // hook for setting the question videos
  const [quesVideoURL, setQuesVideoURL] = useState();
  // hook for setting the game status
  const [finish, setFinish] = useState(false);
  // hook for setting the lobby answers
  const [flagLobby, setFlagLobby] = useState(true);
  // hook for setting the question time limit
  const [timeToDo, setTimeToDo] = useState();
  const [correctAnswerList, setCorrectAnswerList] = useState([]);
  // hook for setting the media height
  const [height, setHeight] = useState(0)
  // hook for setting the question action status
  const [flagStart, setFlagStart] = useState(false);
  // hook for setting the question points
  const [point, setPoint] = useState(0);
  // hook for setting the question player
  const [currPlayer, setCurrPlayer] = useState('');
  // hook for setting the question curretn player
  const [currPlayerPoint, setCurrPlayerPoint] = useState('');
  const [maxPoint, setMaxPoint] = useState(0);
  const [correctQ, setCorrectQ] = useState(0);
  // hook for setting the question image
  const [defaultImage, setDefaultImage] = useState('');
  const [polling, setPolling] = useState(0);
  const [playerData, setPlayerData] = useState({})
  const [gainedPoint, setGainedPoint] = useState(0);
  const [maxQ, setMaxQ] = useState(0);
  const [idofQues, setIdofQues] = useState('');
  const tempAPI = new AllAPI();
  const playerId = currlocation.state?.playerId;
  const playerName = currlocation.state?.playerName;
  const history = useHistory();

  // func to check the answer player tick
  const userAnswerTicker = async (option) => {
    const updatedAnswerList = answerList.includes(option.id)
      ? answerList.filter(id => id !== option.id)
      : [...answerList, option.id];

    setAnswerList(updatedAnswerList);
    setCurrPlayerPoint(point);

    const body = {
      answerIds: updatedAnswerList,
    }

    try {
      await tempAPI.putAPIRequestBody(`play/${playerId}/answer`, body);
    } catch (error) {
      console.warn(error);
    }
  }
  // func to display video
  const videoDisplayer = (video) => {
    setHeight(video ? 360 : 0);
    setQuesVideoURL(video);
  }

  // func to check the answer
  const userAnswerChecker = async () => {
    try {
      const response = await tempAPI.getAPIRequest(`play/${playerId}/answer`);
      const tempData = await response.json();
      if (response.ok) {
        setCorrectAnswerList(tempData.answerIds);
        if (tempData.answerIds.join() === answerList.join()) {
          setGainedPoint(gainedPoint + currPlayerPoint);
          setCorrectQ(correctQ + 1);
        }
      }
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    const poll = async () => {
      try {
        const response = await tempAPI.getAPIRequest(`play/${playerId}/question`);
        const tempData = await response.json();
        if (response.ok) {
          if ((finish || !flagStart) && (tempData.question.id !== idofQues)) {
            setAnswerList([]);
            setCorrectAnswerList([]);
            setQuestionDiscription(tempData.question.text);
            setTypeOfQuestion(tempData.question.type);
            setDefaultImage(tempData.question.thumbnail);
            setPoint(tempData.question.point);
            setChoices(tempData.question.answers);
            videoDisplayer(tempData.question.video);
            setIdofQues(tempData.question.id);
            !timeToDo && setTimeToDo(tempData.question.time_limit);
            setMaxPoint(maxPoint + tempData.question.point);
            setMaxQ(maxQ + 1);
            setCurrPlayerPoint(0);
            setFlagStart(true);
            setFinish(false);
            setPolling(0);
            setFlagLobby(false);
          }
        } else {
          if (!flagLobby) {
            setFlagLobby(true);
            history.push({
              pathname: '/gameresult',
              state: {
                playerData
              }
            })
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
    poll();
    // send the player data to backend
    setPlayerData({
      name: currPlayer,
      point: gainedPoint,
      maxPoint,
      correctQ,
      maxQ
    });
    // custom the point deduction
    if (timeToDo % 2) {
      setPoint(point - 0.5);
    }
    const timeout = polling >= 0 && setTimeout(() => setPolling(polling + 1), 2000);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [polling]);
  // func check the status
  useEffect(() => {
    const playerNameGetter = async () => {
      try {
        const response = await tempAPI.getAPIRequest(`play/${playerId}/question`);
        if (!response.ok) {
          setCurrPlayer(playerName);
        }
      } catch (error) {
        console.warn(error);
      }
    }
    playerNameGetter();
  }, []);

  useEffect(() => {
    const timeout = timeToDo > 0 && setTimeout(() => setTimeToDo(timeToDo - 1), 1000);

    if (timeToDo === 0) {
      setFinish(true);
      userAnswerChecker();
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [timeToDo]);

  return (
    <>
      {flagLobby && <GameLobby></GameLobby>}
      {!flagLobby && (
        <Container
          sx={{ backgroundColor: 'pink', height: '100vh' }}
          maxWidth={false}
        >
          <Container maxWidth="lg">
            <Grid container>
              <Grid item xs={12}>
                <h1>{questionDiscription}</h1>
              </Grid>
              <Grid item xs={12}>
                <ReactPlayer
                  playing={true}
                  height={height}
                  loop={false}
                  controls={true}
                  url={quesVideoURL}
                />
              </Grid>
              <Grid item xs={12}>
                {defaultImage && (
                  <CardMedia
                    component="img"
                    height={400}
                    width={400}
                    image={defaultImage}
                    alt="Question Thumbnail"
                  />
                )}
              </Grid>
              <Grid item xs={10}>
                {typeOfQuestion && (
                  <h3>
                    {typeOfQuestion.charAt(0).toUpperCase() +
                      typeOfQuestion.slice(1)} choice question
                  </h3>
                )}
              </Grid>
              <Grid item xs={2}>
                <h2>{timeToDo}</h2>
              </Grid>
              {(!finish)
                ? choices &&
                  choices.map((option, index) => (
                    <Grid item key={index} xs={6}>
                      <Card>
                        <CardContent>
                          <Grid container>
                            <Grid item xs={10}>
                              <QuestionDiscription>
                                {option.answerText}
                              </QuestionDiscription>
                            </Grid>
                            <Grid item xs={2}>
                              <Checkbox
                                color="default"
                                onChange={() => userAnswerTicker(option)}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                : choices &&
                  choices.map((option, index) => (
                    <Grid item key={index} xs={6}>
                      <Card>
                        <CardContent
                          className={
                            correctAnswerList.includes(option.id)
                              ? 'success.main'
                              : 'error.main'
                          }
                        >
                          <Grid container>
                            <Grid item xs={12}>
                              <Typography
                                style={{
                                  fontSize: 30,
                                  color: correctAnswerList.includes(option.id) ? 'green' : 'red',
                                }}
                              >
                                {option.answerText}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
        </Container>
      </Container>
      )}
    </>
  );
};

export default PagePlay;

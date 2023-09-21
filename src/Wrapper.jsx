import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PageRegister from './pages/PageRegister';
import PageDashBoard from './pages/PageDashBoard';
import PageLogin from './pages/PageLogin';
import PageEditQuiz from './pages/PageEditQuiz';
import PageEditQuestion from './pages/PageEditQuestion';
import PagePlay from './pages/PagePlay';
import PagePlayerResults from './pages/PageGameResults';
import PageJoin from './pages/PageJoin';
import PageGameResult from './pages/PagePlayerResult'

function Wrapper () {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={PageLogin} />
        <Route path="/register" component={PageRegister} />
        <Route path="/dashboard" component={PageDashBoard} />
        <Route path="/editquestion/:id/:qid" component={PageEditQuestion} />
        <Route path="/edit/:quizId" component={PageEditQuiz} />
        <Route path="/join" component={PageJoin} />
        <Route path="/play/:sessionId" component={PagePlay} />
        <Route path="/results/:sessionId" component={PagePlayerResults} />
        <Route path="/gameresult" component={PageGameResult} />
      </Switch>
    </Router>
  );
}

export default Wrapper;

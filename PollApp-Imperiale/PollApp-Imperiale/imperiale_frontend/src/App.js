import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from "./pages/home";
import CreatePoll from "./pages/create";
import VotePoll from "./pages/vote";

const App = () => {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/newPoll" component={CreatePoll} />
          <Route exact path="/votePoll/:id" component={VotePoll} />
          <Route exact path="/editPoll/:id" component={CreatePoll} />
        </Switch>
      </BrowserRouter>
  );
};

export default App;

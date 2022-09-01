import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Alert from "@mui/material/Alert";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Modal,
  LinearProgress,
  TextField,
  Snackbar,
} from "@mui/material";
import * as React from "react";
import PropTypes from "prop-types";

const today = new Date();
let dateFormat =
  today.getFullYear() +
  "/" +
  parseInt(today.getMonth() + 1) +
  "/" +
  today.getDate();

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Home = () => {
  const [poll, setPoll] = useState(null);
  const [login, setlogin] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [errorForm, setErrorForm] = useState(false);
  const [isPaused, setPause] = useState(false);
  const [stateAlert, setStateAlert] = React.useState(false);
  const [messageAlert, setMessageAlert] = React.useState("");

  let history = useHistory();
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3030");
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    let loginUser = sessionStorage.getItem(`loginUser`);
    if (!loginUser) {
      sessionStorage.setItem(`loginUser`, false);
    } else {
      setlogin(loginUser === "true" ? true : false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = (e) => {
      if (isPaused) return;
      const message = e.data;
      if (message === "Update") {
        loadData();
        showMessage("Data are Update");
      }
    };
  }, [isPaused]);

  const loadData = () => {
    fetch("http://localhost:3000/polls")
      .then((response) => response.json())
      .then((res) => {
        setPoll(res.reverse());
      });
  };

  const singIn = () => {
    setlogin(true);
    sessionStorage.setItem(`loginUser`, true);
    handleClose();
    showMessage("Sing In Succes");
  };
  const singOut = () => {
    setlogin(false);
    sessionStorage.setItem(`loginUser`, false);
    showMessage("Sing Out Succes");
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const totalVotes = (answer) => {
    return answer.reduce((acc, curr) => acc + curr.vote, 0);
  };

  const compareDates = (a, b) => {
    const x = new Date(a);
    const y = new Date(b);
    return x >= y;
  };

  const deletePoll = async (id) => {
    if (id) {
      await fetch("http://localhost:3000/polls/" + id, {
        method: "DELETE",
      });
      loadData();
      showMessage("Poll are Delete ");
    }
  };

  const resetPoll = async (poll) => {
    if (poll) {
      poll.answers.forEach((element) => {
        element.vote = 0;
      });
      let body = poll;
      await fetch("http://localhost:3000/polls/" + poll._id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      loadData();
    }
  };

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
  LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
  };

  function handleClick() {
    history.push("/newPoll");
    history.go("/newPoll");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    let user = event.target.elements["user"].value;
    let password = event.target.elements["password"].value;
    if (user === "Admin" && password === "password1234") {
      setErrorForm(false);
      singIn();
    } else {
      setErrorForm(true);
    }
  };

  const votePoll = (id) => {
    history.push(`/votePoll/${id}`);
    history.go(`/votePoll/${id}`);
  };

  const editPoll = (id) => {
    history.push(`/editPoll/${id}`);
    history.go(`/editPoll/${id}`);
  };

  const showMessage = (message) => {
    setMessageAlert(message);
    setStateAlert(true);
    setTimeout(() => {
      setStateAlert(false);
    }, 1500);
  };

  return (
    <div>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#4a6785",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: "#c1cbd9" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h2" component="div">
                  POOL APLICATION
                </Typography>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  LIST OF POLLS
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#4a6785",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {login && (
              <div>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ float: "right", margin: "10px" }}
                  onClick={() => singOut()}
                >
                  Sing Out
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ float: "right", margin: "10px" }}
                  onClick={() => handleClick()}
                >
                  Create Poll
                </Button>
              </div>
            )}
            {!login && (
              <Button
                size="small"
                hidden={login}
                variant="contained"
                sx={{ float: "right", margin: "10px" }}
                onClick={handleOpen}
              >
                sing in
              </Button>
            )}
          </Grid>
          {poll?.map((poll) => {
            return (
              <Grid item xs={6} key={poll._id}>
                <Card sx={{ margin: "50px", backgroundColor: "#ededed" }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 16, textAlign:"center"}}
                      color="white"
                      backgroundColor={
                        compareDates(poll.endDate, dateFormat) ? "#7ab37a" : "#c76e6e"
                      }
                      gutterBottom
                    >
                      From {poll.startDate} To {poll.endDate}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ textAlign: "center", color: "#4a6785" }}
                    >
                      {poll.title}
                    </Typography>
                    {poll.answers?.map((answer) => {
                      return (
                        <div>
                          <Typography
                            variant="h6"
                            color="primary"
                            key={answer._id}
                          >
                            <br />- {answer.text}
                            <br />
                          </Typography>
                          <Box sx={{ width: "100%" }}>
                            <LinearProgressWithLabel
                              value={
                                answer.vote !== 0
                                  ? (answer.vote / totalVotes(poll.answers)) *
                                    100
                                  : 0
                              }
                            />
                            <Typography
                              sx={{ fontSize: 12 }}
                              color="text.secondary"
                              key={answer._id}
                            >
                              Count Vote: {answer.vote}
                            </Typography>
                          </Box>
                        </div>
                      );
                    })}
                  </CardContent>
                  <CardActions sx={{ float: "right" }}>
                    {login && (
                      <div>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => deletePoll(poll._id)}
                          sx={{ marginRight: "5px" }}
                        >
                          Delete
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => editPoll(poll._id)}
                          sx={{ marginRight: "5px" }}
                        >
                          edit
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => resetPoll(poll)}
                          sx={{ marginRight: "5px" }}
                        >
                          Reset
                        </Button>
                      </div>
                    )}
                    {compareDates(poll.endDate, dateFormat) && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => votePoll(poll._id)}
                      >
                        Vote
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            SING IN
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="user"
              required
              placeholder="User"
              fullWidth
              sx={{ marginTop: "15px" }}
            />
            <TextField
              name="password"
              required
              placeholder="Password"
              type="password"
              fullWidth
              sx={{ marginTop: "15px" }}
            />
            {errorForm && (
              <Alert
                sx={{ marginTop: "15px" }}
                variant="filled"
                severity="warning"
              >
                User or Password are incorrect
              </Alert>
            )}
            <Button
              size="small"
              variant="contained"
              sx={{ float: "right", margin: "10px" }}
              type="submit"
            >
              Sing in
            </Button>
            <Button
              size="small"
              variant="contained"
              sx={{ float: "right", margin: "10px" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </form>
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={stateAlert}
        onClose={handleClose}
        message={messageAlert}
        key={"bottom" + "center"}
      />
    </div>
  );
};

export default Home;

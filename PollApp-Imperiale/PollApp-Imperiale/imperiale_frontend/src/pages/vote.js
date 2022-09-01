import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Checkbox,
  Button,
  Grid,
} from "@mui/material";

const VotePoll = () => {
  const [poll, setPoll] = useState({});
  const [answerId, setAnswerId] = useState(null);
  const { id: pollId } = useParams();
  let history = useHistory();

  useEffect(() => {
    fetch("http://localhost:3000/polls/" + pollId)
      .then((respose) => respose.json())
      .then(setPoll);
  }, [pollId]);

  useEffect(() => {
    if (poll.answers) {
      setAnswerId(poll.answers[0]._id);
    }
  }, [poll]);

  const cancel = () => {
    history.push("/");
    history.go("/");
  };

  const submitVote = async () => {
    await fetch("http://localhost:3000/polls/" + pollId + "/vote/" + answerId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    history.push("/");
    history.go("/");
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
                  VOTE POLL
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={6} key={poll._id}>
            <Card sx={{ margin: "50px", backgroundColor: "#ededed" }}>
              <CardContent>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ textAlign: "center", color: "#4a6785" }}
                >
                  {poll.title}
                </Typography>
                {poll.answers?.map((answer) => {
                  return (
                    <div key={answer._id}>
                      <Typography variant="h6" color="primary" key={answer._id}>
                        <Checkbox
                          onChange={() => setAnswerId(answer._id)}
                          checked={answer._id === answerId}
                        />{" "}
                        {answer.text}
                      </Typography>
                    </div>
                  );
                })}
              </CardContent>
              <CardActions sx={{ float: "right" }}>
                <Button size="small" variant="contained" onClick={submitVote}>
                  Vote
                </Button>
                <Button size="small" variant="contained" onClick={cancel}>
                  Cancel
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default VotePoll;

import { useState, useEffect } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useHistory, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const today = new Date();
let dateFormat =
  today.getFullYear() +
  "/" +
  parseInt(today.getMonth() + 1) +
  "/" +
  today.getDate();

const CreatePoll = () => {
  const [poll, setPoll] = useState({});
  const [newPoll, setNewPoll] = useState({});
  const { id: pollId } = useParams();
  const [endDate, setEndDate] = useState(today);
  const [errorForm, setErrorForm] = useState(false);
  const [flagDate, setFlagDate] = useState(false);
  const [title, setTitle] = useState("");
  const [answer1, setAnswer1] = useState(null);
  const [answer2, setAnswer2] = useState(null);
  const [answer3, setAnswer3] = useState(null);
  const [answer4, setAnswer4] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (pollId) {
      fetch("http://localhost:3000/polls/" + pollId)
        .then((respose) => respose.json())
        .then(setPoll);
    }
  }, [pollId]);

  useEffect(() => {
    if (poll.answers) {
      setNewPoll(poll);
    }
  }, [poll]);

  useEffect(() => {
    if (poll.answers) {
      setNewPoll(poll);
      setTitle(poll.title);
      setEndDate(poll.endDate.replace("/", "/"));
      newPoll.answers.forEach((element, index) => {
        if (index === 0) setAnswer1(element.text);
        if (index === 1) setAnswer2(element.text);
        if (index === 2) setAnswer3(element.text);
        if (index === 3) setAnswer4(element.text);
      });
    }
  }, [newPoll]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pollId) {
      const answers = [answer1, answer2, answer3, answer4].filter(Boolean);
      if (title && answers.length >= 2 && endDate) {
        let enddateFormat = endDate;
        if (flagDate) {
          enddateFormat =
            endDate?.getFullYear() +
            "/" +
            parseInt(endDate?.getMonth() + 1) +
            "/" +
            endDate?.getDate();
        }

        setErrorForm(false);
        newPoll.title = title;
        newPoll.endDate = enddateFormat;
        newPoll.answers.forEach((element, index) => {
          if (index === 0) element.text = answer1;
          if (index === 1) element.text = answer2;
          if (index === 2) element.text = answer3;
          if (index === 3) element.text = answer4;
        });
        if (newPoll.answers.length !== answers.length) {
          if (!newPoll.answers[2])
            newPoll.answers.push({ text: answer3, vote: 0 });
          if (!newPoll.answers[3])
            newPoll.answers.push({ text: answer4, vote: 0 });
        }
        newPoll.answers = newPoll.answers.filter(
          (ele) => ele.text !== "" && ele.text !== null
        );
        await fetch("http://localhost:3000/polls/" + pollId, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPoll),
        });
        history.push("/");
        history.go("/");
      } else {
        setErrorForm(true);
      }
    } else {
      const answers = [answer1, answer2, answer3, answer4].filter(Boolean);
      if (title && answers.length >= 2 && endDate) {
        setErrorForm(false);
        let enddateFormat =
          endDate?.getFullYear() +
          "/" +
          parseInt(endDate?.getMonth() + 1) +
          "/" +
          endDate?.getDate();

        let answerFinal = [];
        answers.forEach((obj) => {
          answerFinal.push({ text: obj });
        });
        const body = {
          title: title,
          answers: answerFinal,
          startDate: dateFormat,
          endDate: enddateFormat,
        };
        await fetch("http://localhost:3000/polls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        history.push("/");
        history.go("/");
      } else {
        setErrorForm(true);
      }
    }
  };
  const cancel = () => {
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
                  {pollId ? "EDIT POLL" : "CREATE A NEW POLL"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <Card sx={{ margin: "10px", backgroundColor: "#ededed" }}>
              <form onSubmit={handleSubmit}>
                <CardContent>
                  <h2> {pollId ? "EDIT" : "NEW POLL"}</h2>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      name="endDate"
                      minDate={today}
                      required
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                        setFlagDate(true);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <TextField
                    name="question"
                    value={title}
                    onChange={(newValue) => {
                      setTitle(newValue.target.value);
                    }}
                    required
                    placeholder="Title Question*"
                    fullWidth
                    sx={{ marginTop: "15px" }}
                  />
                  <div style={{ marginTop: "15px" }}>
                    <TextField
                      key={1}
                      fullWidth
                      value={answer1}
                      onChange={(newValue) => {
                        setAnswer1(newValue.target.value);
                      }}
                      name={`answer-1`}
                      placeholder={`Answer #1`}
                      sx={{ marginTop: "15px" }}
                    />
                    <TextField
                      key={2}
                      fullWidth
                      value={answer2}
                      onChange={(newValue) => {
                        setAnswer2(newValue.target.value);
                      }}
                      name={`answer-2`}
                      placeholder={`Answer #12`}
                      sx={{ marginTop: "15px" }}
                    />
                    <TextField
                      key={3}
                      fullWidth
                      value={answer3}
                      name={`answer-3`}
                      onChange={(newValue) => {
                        setAnswer3(newValue.target.value);
                      }}
                      placeholder={`Answer 31`}
                      sx={{ marginTop: "15px" }}
                    />
                    <TextField
                      key={4}
                      fullWidth
                      value={answer4}
                      onChange={(newValue) => {
                        setAnswer4(newValue.target.value);
                      }}
                      name={`answer-4`}
                      placeholder={`Answer #4`}
                      sx={{ marginTop: "15px" }}
                    />
                  </div>
                </CardContent>
                {errorForm && (
                  <Alert variant="filled" severity="warning">
                    Minimum two answers are required
                  </Alert>
                )}
                <CardActions sx={{ float: "right" }}>
                  <Button size="small" type="submit" variant="contained">
                    {pollId ? "Edit" : "Create"}
                  </Button>
                  <Button size="small" variant="contained" onClick={cancel}>
                    Cancel
                  </Button>
                </CardActions>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default CreatePoll;

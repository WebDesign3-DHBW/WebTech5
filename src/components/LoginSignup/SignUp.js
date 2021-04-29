import React from "react";
import { useState } from "react";
import { navigate, Link } from "@reach/router";
import { signUp } from "../../auth/signUp";
import { validate as isEmail } from "isemail";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core/";
import { Wrapper } from "./Wrapper";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: theme.spacing(2),
    "& label.Mui-focused": {
      color: theme.palette.grey[900],
    },
  },
  button: {
    marginTop: theme.spacing(2),
    color: theme.palette.grey[900],
  },
  link: {
    textDecoration: "none",
    color: theme.palette.grey[900],
  },
  errorMessage: {
    marginBottom: theme.spacing(2),
    color: theme.palette.error.main,
  },
}));

function SignUp({ location }) {
  const classes = useStyles();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSignUpClicked = async () => {
    setErrorMessage("");
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      const signUpSuccessful = await signUp(usernameValue, emailValue, passwordValue);
      signUpSuccessful && navigate(`/login`, { state: { signUpSuccessful } });
    } catch (e) {
      switch (e.message) {
        case "auth/email-already-in-use":
          setErrorMessage("Die angegebene E-Mail Adresse wird bereits verwendet.");
          break;
        case "auth/weak-password":
          setErrorMessage("Dein Passwort muss mehr als sechs Zeichen haben.");
          break;
        default:
          setErrorMessage(
            "Leider ist ein Fehler aufgetreten. Bitte überprüfe deine Eingabe oder probiere es später noch einmal."
          );
      }
    }
  };

  const validateForm = () => {
    if (!usernameValue) return "Bitte einen Nutzernamen eingeben.";
    if (!emailValue) return "Bitte eine E-Mail Adresse eingeben.";
    if (!isEmail(emailValue)) return "Bitte eine gültige E-Mail Adresse eingeben.";
    if (passwordValue !== confirmPassword) return "Die Passwörter stimmen nicht überein.";
    return null;
  };

  return (
    <Wrapper>
      <div>
        {errorMessage ? <div className={classes.errorMessage}> {errorMessage} </div> : null}
        <form noValidate autoComplete="off">
          <TextField
            type="text"
            label="Nutzername"
            fullWidth
            className={classes.textField}
            onChange={(e) => setUsernameValue(e.target.value)}
          />
          <TextField
            type="email"
            label="E-Mail"
            fullWidth
            className={classes.textField}
            onChange={(e) => setEmailValue(e.target.value)}
          />
          <TextField
            type="password"
            label="Passwort"
            fullWidth
            className={classes.textField}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
          <TextField
            type="password"
            label="Passwort wiederholen"
            fullWidth
            className={classes.textField}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </form>
        <Button
          variant="contained"
          color="primary"
          fullWidth={true}
          className={classes.button}
          onClick={onSignUpClicked}
        >
          Registrieren
        </Button>
        <Button variant="outlined" color="primary" fullWidth={true} className={classes.button}>
          <Link to="/login" className={classes.link}>
            Einloggen
          </Link>
        </Button>
      </div>
    </Wrapper>
  );
}

export default SignUp;
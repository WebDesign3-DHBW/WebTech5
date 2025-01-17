import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import { makeStyles } from "@material-ui/core";
import { addGroupToUser } from "../../firebase/addGroupToUser";
import { getCurrentUserData } from "../../firebase/getCurrentUserData";

const useStyles = makeStyles((theme) => ({
  textField: {
    "& label.Mui-focused": {
      color: theme.palette.text.primary,
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    padding: 0,
    paddingTop: 20,
  },
  button: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

export default function JoinGroup({ close, updateBubbles, setSnackbarContent }) {
  const classes = useStyles();
  const [value, setValue] = useState();

  const checkIfGroupsExists = async (user, groupID) => {
    const currentUserGroups = user.groups;
    return groupID in currentUserGroups ? true : false;
  };

  async function addGroupToDB(user, groupName, groupID, groupColor) {
    user.groups[groupID] = { name: groupName, color: "#" + groupColor };
    addGroupToUser(user.groups);
  }

  function generateGroupObject(inputValue) {
    const groupName = inputValue.substring(0, inputValue.indexOf("/"));
    const groupID = inputValue.substring(inputValue.indexOf("/") + 1, inputValue.length - 6);
    const groupColor = inputValue.slice(-6);
    return [groupName, groupID, groupColor];
  }

  const handleJoin = async () => {
    if (!value) {
      setSnackbarContent({
        message: "Bitte gib einen validen Gruppencode ein.",
        status: "error",
        open: true,
      });
      return;
    }

    const [groupName, groupID, groupColor] = generateGroupObject(value);
    let user = await getCurrentUserData();

    if (await checkIfGroupsExists(user, groupID)) {
      setSnackbarContent({
        message: "Du bist dieser Gruppe bereits beigetreten!",
        status: "info",
        open: true,
      });
    } else if (value.includes("/_") && value.length > 17) {
      await addGroupToDB(user, groupName, groupID, groupColor);
      setSnackbarContent({
        message: "Du bist der Gruppe erfolgreich beigetreten!",
        status: "success",
        open: true,
      });
      close();
      updateBubbles();
    } else {
      setSnackbarContent({
        message: "Dein Gruppencode ist nicht valide",
        status: "error",
        open: true,
      });
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <DialogContentText>Gib deinen Gruppencode ein, um einer Gruppe beizutreten</DialogContentText>
      <TextField
        autoFocus
        className={classes.textField}
        margin="dense"
        id="name"
        label="Gruppencode"
        type="textfield"
        value={value}
        onChange={handleChange}
        fullWidth
      />

      <DialogActions className={classes.buttons}>
        <Button onClick={close} className={classes.button}>
          Schließen
        </Button>

        <Button onClick={handleJoin} className={classes.button} color="primary">
          Beitreten
        </Button>
      </DialogActions>
    </div>
  );
}

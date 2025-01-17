import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  TextField,
  withStyles,
} from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getAllUserData } from "../../firebase/getAllUserData";
import { addListEntry } from "../../firebase/addListEntry";
import Snackbar from "../Snackbar";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    width: "100%",
    height: "100%",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
  dialogTitle: {
    textAlign: "center",
    minWidth: 311,
    "& h2": {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
    },
  },
  textField: {
    display: "flex",
    marginBottom: theme.spacing(2),
  },
  formControl: {
    display: "flex",
    marginBottom: theme.spacing(2),
  },
}));

export default function ListPopup({ open, close, cardTitle, list, triggerUpdate }) {
  const classes = useStyles();
  const [selectedGroup, setSelectedGroup] = useState({ groupID: "", color: "" });
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");
  const [userData, isUserData] = useCurrentUser();
  const [isLoading, setIsLoading] = useState(true);
  const [allUserInGroup, setAllUserInGroup] = useState();
  const [snackbarContent, setSnackbarContent] = useState();

  useEffect(() => {
    const getUserInGroup = async () => {
      setIsLoading(true);
      const allUserData = await getAllUserData();
      const groupUserNames = allUserData
        .filter((user) => Object.keys(user.groups).some((id) => id === selectedGroup.groupID))
        .map((user) => ({
          name: user.userName,
          id: user.userId,
        }));
      setAllUserInGroup(groupUserNames);
      setIsLoading(false);
    };
    getUserInGroup();
  }, [selectedGroup]);

  const handleDropDown = (e) => {
    const groupID = e.target.value.substring(0, e.target.value.indexOf("/"));
    const color = e.target.value.substring(e.target.value.indexOf("/") + 1);
    setSelectedGroup({ groupID, color });
  };

  const handleSelectUser = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleSelectDate = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleSave = async (e) => {
    if (title && selectedDate && selectedGroup.groupID && selectedUser) {
      await addListEntry({
        title,
        date: selectedDate,
        groupID: selectedGroup.groupID,
        color: selectedGroup.color,
        assignedTo: selectedUser,
        list,
      });
      setSnackbarContent({
        message: "Dein Eintrag wurde erfolgreich erstellt.",
        status: "success",
        open: true,
      });
      triggerUpdate();
      close();
      setTitle("");
    } else {
      setSnackbarContent({
        message: "Fülle bitte alle Felder aus!",
        status: "error",
        open: true,
      });
    }
  };

  return (
    <>
      <Snackbar snackbarContent={snackbarContent} setSnackbarContent={setSnackbarContent} />
      <Dialog open={open} onClose={close}>
        <DialogTitle id="filme-serien-hinzufügen" className={classes.dialogTitle}>
          {cardTitle} hinzufügen
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.root}>
            <TextField
              id="task title"
              label="Titel"
              onChange={handleTitle}
              value={title}
              style={{ marginBottom: 10 }}
              className={classes.textField}
            />
            <TextField
              id="date"
              onChange={handleSelectDate}
              label="Frist"
              type="date"
              value={selectedDate}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="selectGroup">Gruppe</InputLabel>
              <Select
                native
                value={`${selectedGroup.groupID}/${selectedGroup.color}`}
                onChange={handleDropDown}
              >
                <option aria-label="None" value="" />
                {!isUserData &&
                  Object.entries(userData.groups).map((group, idx) => (
                    <option key={idx} value={`${group[0]}/${group[1].color}`}>
                      {group[1].name}
                    </option>
                  ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="zuständiger">Zuständig</InputLabel>
              <Select native value={selectedUser} onChange={handleSelectUser}>
                <option aria-label="None" value="" />
                {!isLoading &&
                  allUserInGroup.map((user, idx) => (
                    <option key={idx} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions className={classes.buttons}>
          <Button autoFocus onClick={close}>
            Abbrechen
          </Button>
          <Button autoFocus onClick={handleSave} color="primary">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

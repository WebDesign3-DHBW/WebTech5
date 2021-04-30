import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  Slide,
  Snackbar,
  TextField,
} from "@material-ui/core";
import { getCurrentUserData } from "../../firebase/getCurrentUserData";
import { updateCurrentUserData, updateUserName } from "../../firebase/updateCurrentUserData";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
    maxWidth: 500,
    height: "100%",
    padding: theme.spacing(2),
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

export default function ProfilePopup({ open, close }) {
  const classes = useStyles();
  const [userName, setUserName] = useState();
  const [profileImage, setProfileImage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState();

  // load user data in state
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      const currentUserData = await getCurrentUserData();
      setUserName(currentUserData.userName);
      setProfileImage(currentUserData.profileImage);
      setIsLoading(false);
      console.log("infinite loop warning!");
    };
    loadUserData();
  }, []);

  const handleChange = (event) => {
    setUserName(event.target.value);
  };

  const handleSave = () => {
    if (userName) {
      saveUserNameToDB();
    } else {
      setSnackbarContent({
        message: "Dein Name darf nicht leer sein.",
        status: "error",
        open: true,
      });
    }
  };

  async function saveUserNameToDB() {
    updateCurrentUserData({ userName });
    setSnackbarContent({
      message: "Du hast deinen Nutzernamen erfolgreich geändert!",
      status: "success",
      open: true,
    });
  }

  return (
    <>
      {snackbarContent?.open && (
        <Snackbar
          open={snackbarContent.open}
          autoHideDuration={5000}
          onClose={() =>
            setSnackbarContent((prevState) => {
              return { ...prevState, open: false };
            })
          }
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          TransitionComponent={Slide}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            className={classes.snackbar}
            severity={snackbarContent.status}
            onClose={() =>
              setSnackbarContent((prevState) => {
                return { ...prevState, open: false };
              })
            }
          >
            {snackbarContent.message}
          </MuiAlert>
        </Snackbar>
      )}
      <Dialog open={open} onClose={close}>
        <div className={classes.root}>
          <Avatar alt="Avatar" src="https://flerka.github.io/personal-blog/img/avatar-icon.png" />
          <Button>Bild ändern</Button>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="textfield"
            fullWidth
            value={userName}
            onChange={handleChange}
          />
          <DialogActions className={classes.buttons}>
            <Button onClick={close} className={classes.button}>
              Schließen
            </Button>
            <Button color="primary" onClick={handleSave} className={classes.button}>
              Speichern
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}

//   aus octo waffle
//   handleUpload = e => {
//     if (e.target.files[0] && e.target.files[0] !== this.state.image) {
//       const image = e.target.files[0];
//       this.setState(
//         () => ({ image }),
//         () => {
//           const { image } = this.state;
//           const uploadTask = storage.ref(`profileImages/${image.name}`).put(image);
//           uploadTask.on(
//             "state_changed",
//             snapshot => {
//               const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//               this.setState({ progress });
//             },
//             error => {
//               console.log(error);
//             },
//             () => {
//               storage
//                 .ref("profileImages")
//                 .child(image.name)
//                 .getDownloadURL()
//                 .then(imageUrl => {
//                   this.setState({ imageUrl }, () => {
//                     db.collection("Users")
//                       .doc(this.props.registeredUserId)
//                       .update({ profileImageUrl: this.state.imageUrl });
//                   });
//                 });
//             }
//           );
//         }
//       );
//     }
//   };

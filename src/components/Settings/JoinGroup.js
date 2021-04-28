import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Gruppe beitreten
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"> Gruppe beitreten</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Gebe deinen Gruppencode ein um einer Gruppe beizutreten
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Gruppencode"
            type="textfield"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Abbrechen
          </Button>
          <Button onClick={handleClose} color="primary">
            Beitreten
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
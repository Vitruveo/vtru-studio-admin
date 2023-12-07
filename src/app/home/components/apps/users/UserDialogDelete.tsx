import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box } from '@mui/material';
import CustomTextField from '../../forms/theme-elements/CustomTextField';

interface Props {
  userName: string;
  isOpen: boolean;
  handleConfirm(): void;
  handleCancel(): void;
}

export function UserDialogDelete({ userName, isOpen, handleCancel, handleConfirm }: Props) {
  const [input, setInput] = useState('');

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogTitle>User Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To confirm, type{' '}
          <span
            style={{
              fontWeight: 'bold',
            }}>
            {userName}
          </span>{' '}
          in the box below.
        </DialogContentText>
        <Box mt={2}>
          <CustomTextField
            autoFocus
            margin="dense"
            id="name"
            label="User name"
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="outlined" size="small" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          size="small"
          disabled={input !== userName}
          onClick={() => {
            handleConfirm();
            setInput('');
          }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

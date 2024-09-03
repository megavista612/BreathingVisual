import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const Summary = ({ totalTime, breathCount, onClose }) => {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Session Summary</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Total time: {totalTime} seconds</Typography>
        <Typography variant="body1">Breaths completed: {breathCount}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Summary;
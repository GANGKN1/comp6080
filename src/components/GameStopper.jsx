import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, Grid, Link } from '@mui/material';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

const GameStopper = ({ show, handleClose, id }) => {
  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>Game Finished</DialogTitle>
      <DialogContent>
        <h4 className="text-center">Wanna check the results?</h4>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Link component={RouterLink} to={`/results/${id}`} underline="none">
              <Button fullWidth variant="contained" color="primary" id="yes-click">
                Yeah
              </Button>
            </Link>
          </Grid>
          <Grid item md={6} xs={12}>
            <Button
              id="Nah-btn"
              fullWidth
              variant="contained"
              color="error"
              onClick={() => {
                handleClose();
              }}
            >
              Nah
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
// set the game stopper proptypes
GameStopper.propTypes = {
  setShow: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  allGames: PropTypes.array.isRequired,
  handleShow: PropTypes.func.isRequired,
  setAllGames: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default GameStopper;

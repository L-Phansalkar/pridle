import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Share } from "./Share";
import { List, ListItem } from '@mui/material';
import { getStatsData } from './stats';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  max-width: 400px;
  background-color: #fff;
  border: 2px solid #000;
  box-shadow: 24rem;
  padding: 2em;
  justify-content: flex-start;
  @media (prefers-color-scheme: dark) {
    background-color: #121212;
    color: white;
  }
`;

const StatNumber = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
`;

const StatText = styled.div`
  text-align: center;
`;

const StatsButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  margin-top: 0.6rem;
`;

const StyledModal = styled(Modal)`
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
`;


export function HowToModal({ end, score, guesses, maxAttempts }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <StatsButton onClick={handleOpen}>❓</StatsButton> 
      <StyledModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
          <Typography id="modal-modal-title" variant="h5" component="h2">
              How to play!
          </Typography>
          <Typography id="modal-modal-title" component="p">
            Simply guess the flag in 6 guesses or less!
            Each time you guess it will reveal another portion of the flag and give you a geographical hint.
          </Typography>
        </StyledBox>
      </StyledModal>
    </div>
  );
}

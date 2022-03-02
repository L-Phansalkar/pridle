import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { List, ListItem } from '@mui/material';
import styled from 'styled-components';
import { FlagGrid } from './FlagGrid';
import { Guesses } from './Guesses';
import countryData from './countries';
import { getDistance, getCompassDirection } from 'geolib';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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

const Button = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  margin-top: 0.6rem;
`;

const StyledModal = styled(Modal)`
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
`;

const CenterDiv = styled.div`
  display: ${props => props.display};
  justify-content: center;
`;

const HelpIcon = styled(HelpOutlineIcon)`
  color: black;
  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

export function HowToModal(props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const exampleGuesses = ["Mexico", "Haiti", "Peru", "Chile"];
  const exampleTarget = "Chile";
  const {code:answerCode, ...answerGeo} = countryData[exampleTarget];
  const guesses = exampleGuesses.map(name => {
    const {code:guessCode, ...guessGeo} = countryData[name];
    return {name: name,
            distance: getDistance(guessGeo, answerGeo),
            direction: getCompassDirection(guessGeo, answerGeo)
          }
  })

  return (
    <div>
      <Button onClick={handleOpen}><HelpIcon/></Button>
      <StyledModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
          <Box>
            <IconButton onClick={handleClose} sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            How to play!
          </Typography>
          <Typography id="modal-modal-paragraph" component="p">
            Guess the flag in 6 guesses or less!
          </Typography>
          <Typography id="modal-modal-paragraph" component="p">
            Each time you make a guess it will reveal another portion of the flag and give you a geographical hint.
          </Typography>
          <br />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Example:
          </Typography>
          <CenterDiv display="flex">
            <FlagGrid
              end={false}
              flippedArray={[true, true, false, false, true, false]}
              countryInfo={{ code: answerCode }}
            >
            </FlagGrid>
          </CenterDiv>
          <CenterDiv display="grid">
            <Guesses
              guesses={guesses.slice(0, -1)}
            />
          </CenterDiv>
          <br />
          <Typography id="modal-modal-paragraph" component="p">
            The hint tells you how far away your guess was and the arrow points towards the target country.
          </Typography>
          <Typography id="modal-modal-paragraph" component="p">
            The answer in this case was:
          </Typography>
          <br />
          <CenterDiv display="grid">
            <Guesses
              guesses={guesses.slice(-1)}
            />
          </CenterDiv>
        </StyledBox>
      </StyledModal>
    </div>
  );
}

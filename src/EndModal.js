import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Share } from "./Share";
import { List, ListItem } from '@mui/material';
import { getStatsData } from './stats';
import styled from 'styled-components';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  justifyContent: 'flex-end'
};

const StatNumber = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
`;

const StatText = styled.div`
  text-align: center;
`;

const StatsTile = ({stat, text}) => (
  <Box sx={{ p: 2, borderRadius: '3px', m: '0rem 0.25rem', justifyContent: 'center'}}>
    <StatNumber>{stat}</StatNumber>
    <StatText>{text}</StatText>
  </Box>
)

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto 1fr;
`;

export function EndModal({ end, score, guesses, maxAttempts }) {
  const [open, setOpen] = useState(end);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    played,
    winRatio,
    currentStreak,
    maxStreak,
    guessDistribution,
  } = getStatsData();

  const maxDistribution = Math.max(...Object.values(guessDistribution));

  useEffect(() => setOpen(end), [end]);
  return (
    <div>
      <Button variant="contained" onClick={handleOpen}><span>Stats 📈</span></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Statistics
          </Typography>
          <Grid>
            <StatsTile stat={Math.round(winRatio * 100)} text="Win %"/>
            <StatsTile stat={played} text="Played"/>
            <StatsTile stat={currentStreak} text="Current Streak"/>
            <StatsTile stat={maxStreak} text="Max Streak"/>
          </Grid>
          <Typography id="modal-modal-title" variant="h6" component="h3">
            Guess Distribution:
          </Typography>
          <List>
            {Object.entries(guessDistribution).map(([index, count]) => (
              <ListItem>
                <div>{index}</div>
                <div
                  style={{
                    flex: `0 1 ${Math.round((count / maxDistribution) * 100)}%`,
                    backgroundColor: '#ddd',
                    padding: '2px 5px',
                    borderRadius: '3px',
                    marginLeft: '0.5rem'
                  }}
                >{count}</div>
              </ListItem>
            ))}
          </List>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Share score={score}
                   guesses={guesses} 
                   attempts={maxAttempts}
            >
            </Share>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

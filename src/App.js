import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from "react";
import styled from 'styled-components';
import AnswerBox from './AnswerBox';
import usFlag from './flags-normal/us.png'

const CentreWrapper = styled.div`
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  grid-gap: 2px;
  margin-bottom: 1em;
`;

const EmptyTile = styled.div`
  display:flex; 
  justify-content: center;
  background: #a6b8b9;
  padding: 2rem;
  transition: 1s;
  transform-style: preserve-3d;
  transform: ${props => props.rotate ? "rotateY(180deg)" : "rotateY(0deg)"};
  backface-visibility: hidden;
  position: relative;
`;

const FlagTile = styled(EmptyTile)`
  content: ${props => props.flag};
`;

const TileContainer = styled.div`
  display:flex; 
  justify-content: center;
  background: #a6b8b9;
  padding: 2rem;
  position: relative;
`;

const Results = styled(({ score, attempts, ...props }) => (
  <div {...props}>
    Score: <span>{score}</span>, Attempts: <span>{attempts}</span>
  </div>
))`
  display: block;
  font-size: 1.5em;
  span {
    font-weight: bold;
  }
`;

const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

function App(props) {
  const [flags, setFlags] = useState(() => shuffle(props.flags));
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const nextFlag = () => {
    setFlags(flags.length > 1 ? flags.slice(1) : shuffle(props.flags));
  };

  const onCorrect = () => {
    setScore(attempts);
    // TODO end game and show score
  };

  const onIncorrect = () => {
    if (attempts < props.attempts) {
      setAttempts(attempts + 1);
      // TODO reveal tile
      return;
    }

    setScore(10);
  };

  const [{ emoji, name }] = flags;
  console.log(name)

  return (
    <div className='App'>
      <CentreWrapper>
        <Grid>
            <EmptyTile rotate={attempts === 1}>1</EmptyTile>
            <EmptyTile rotate={attempts === 1}>1</EmptyTile>
            <EmptyTile rotate={attempts === 1}>1</EmptyTile>
            <EmptyTile rotate={attempts === 1}>1</EmptyTile>
            <EmptyTile rotate={attempts === 1}>1</EmptyTile>
            <EmptyTile rotate={attempts === 1}>1</EmptyTile>
        </Grid>
      <AnswerBox
        answer={name}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
      />
      <Results score={score} attempts={attempts} />
      </CentreWrapper>
    </div>
  );
}

export default App;

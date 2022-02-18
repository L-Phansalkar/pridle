import './App.css';
import { useState, useEffect } from "react";
import styled from 'styled-components';
import AnswerBox from './AnswerBox';

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
  margin-bottom: 1rem;
`;

const TileFront = styled.div`
  width:100%;
  height:100%;
  justify-content: center;
  background: #dddddd;
  backface-visibility: hidden;
  position: absolute;
  top:0;
`;

const TileBack = styled.div`
  width:100%;
  height:100%;
  justify-content: center;
  background: #ffffff;
  backface-visibility: hidden;
  position: absolute;
  transform: rotateY(180deg);
  top:0;
  overflow: hidden;
`;

const Tile = styled.div`
  transition: 1s;
  transform-style: preserve-3d;
  display:flex; 
  justify-content: center;
  padding: 2rem;
  position: relative;
  transform: ${props => props.rotate ? "rotateY(180deg)" : "rotateY(0deg)"};
`;

const FlagImage = styled.img`
  content: url(${props => props.flag});
  position: relative;
  width: 192px;
  left: ${props => props.left};
  top: ${props => props.top};
`;

const Results = styled(({ score, attempts, ...props }) => (
  <div {...props}>
    Attempts: <span>{attempts}</span>
  </div>
))`
  display: block;
  font-size: 1.5em;
  font-family: monospace, monospace;
  span {
    font-weight: bold;
  }
`;

const Title = styled.div`
  display: block;
  font-size: 5em;
  font-family: monospace, monospace;
  margin-bottom: 1rem;
  span {
    color: #23b21a;
  }
`;
const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

function App(props) {
  const [flagKeys, setFlagKeys] = useState(() => shuffle(Object.keys(props.flagCodes)));
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const nextFlag = () => {
    setFlagKeys(flagKeys.length > 1 ? flagKeys.slice(1) : shuffle(Object.keys(props.flagCodes)));
    setAttempts(0);
  };

  const onCorrect = () => {
    setScore(attempts);
    // TODO end game and show score
    nextFlag();
  };

  const onIncorrect = () => {
    if (attempts < props.attempts) {
      setAttempts(attempts + 1);
      // TODO reveal tile
      return;
    }

    setScore(10);
  };

  const [flagKey] = flagKeys;
  const name = props.flagCodes[flagKey];
  console.log(name);

  return (
    <div className='App'>
      <CentreWrapper>
        <Title>NATION<span>LE</span></Title>
        <Grid>
          {[0,1,2,3,4,5].map(n => 
          (
            <Tile rotate={attempts >= n+1}>
              <TileFront></TileFront>
              <TileBack><FlagImage
                flag={`https://flagcdn.com/w320/${flagKey}.png`}
                left={`-${(n%3)*64}px`}
                top={`-${Math.floor(n/3)*64}px`}
              >
              </FlagImage></TileBack>
            </Tile>
          ))}
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

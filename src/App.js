import './App.css';
import { useState, useEffect } from "react";
import styled from 'styled-components';
import AnswerBox from './AnswerBox';
import { getDistance, getCompassDirection } from "geolib";
import { formatDistance, getDirectionEmoji } from './geography';

const CentreWrapper = styled.div`
  margin: 0;
  position: absolute;
  overflow: hidden;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
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

const Results = styled(({ score, attempts, max, ...props }) => (
  <div {...props}>
    Attempts: <span>{attempts}/{max}</span>
  </div>
))`
  display: block;
  font-size: 1.5em;
  font-family: Courier, monospace;
  margin-bottom: 1rem;
  span {
    font-weight: bold;
  }
`;

const Title = styled.div`
  display: block;
  font-size: 4rem;
  font-family: Courier, monospace;
  margin-bottom: 1rem;
  span {
    color: #23b21a;
  }
`;

const EndScreen = styled.div`
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
  transition: 1s;
  opacity:${props => props.end ? 0.8 : 0};
  z-index:${props => props.end ? 2 : -1};
  background-color: #dddddd;
  font-family: Courier, monospace;
  font-size: 1.5em;
`;

const Guess = styled.div`
  display:flex; 
  justify-content: center;
  padding: 0.5rem 2rem;
  position: relative;
  background-color: #dddddd;
  font-family: Courier, monospace;
`;

const GuessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: auto 1fr;
  grid-gap: 2px;
  margin-bottom: 1rem;
`;

const ResultsBox = styled.div`
  padding: 2rem 2rem;
  background-color: #dddddd;
`;

const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

function App(props) {
  const [flagNames, setFlagNames] = useState(() => shuffle(Object.keys(props.countryData)));
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [flippedArray, setFlippedArray] = useState([false, false, false, false, false, false]);
  const [randomOrder, setRandomOrder] = useState(() => shuffle([0,1,2,3,4,5]));
  const [end, setEnd] = useState(false);
  const [guesses, setGuesses] = useState([]);

  const nextFlag = () => {
    setFlagNames(flagNames.length > 1 ? flagNames.slice(1) : shuffle(Object.keys(props.countryData)));
  };

  const onCorrect = () => {
    setScore(attempts);
    // TODO end game and show score
    setAttempts(0);
    setFlippedArray([true, true, true, true, true, true]);
    setEnd(true);
    // nextFlag();
  };

  const revealTile = () => {
    const [tile] = randomOrder;
    setRandomOrder(randomOrder.length > 1 ? randomOrder.slice(1) : shuffle([0,1,2,3,4,5]));
    const newFlipped = flippedArray.slice();
    newFlipped[tile] = true;
    setFlippedArray(newFlipped);
  };

  const onIncorrect = () => {
    if (attempts < props.attempts - 1) {
      setAttempts(attempts + 1);
      revealTile();
      setScore(attempts)
      return;
    }
    setAttempts(attempts + 1);
    setEnd(true);
    revealTile();
    setScore("DNF");
  };

  const onGuess = guess => {
    const {code:guessCode, ...guessGeo} = props.countryData[guess];
    const {code:answerCode, ...answerGeo} = props.countryData[answer];
    setGuesses(guesses => [...guesses, {name: guess, distance: getDistance(guessGeo, answerGeo),
                                        direction: getCompassDirection(guessGeo, answerGeo)}]);
  };

  const [answer] = flagNames;
  const countryInfo = props.countryData[answer];

  return (
    <div className='App'>
      <CentreWrapper>
        <EndScreen end={end}>
        <ResultsBox>
            <p>{answer}</p>
            <p>Score: {score}</p>
        </ResultsBox>
        </EndScreen>
        <Title>FLAG<span>LE</span></Title>
        <Grid>
          {flippedArray.map((flipped, n) => 
          (
            <Tile key={n} rotate={flipped}>
              <TileFront></TileFront>
              <TileBack><FlagImage
                flag={`https://flagcdn.com/w320/${countryInfo.code}.png`}
                left={`-${(n%3)*64}px`}
                top={`-${Math.floor(n/3)*64}px`}
              >
              </FlagImage></TileBack>
            </Tile>
          ))}
        </Grid>
      <AnswerBox
        answer={answer}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
        disabled={end}
        countries={Object.keys(props.countryData)}
        onGuess={onGuess}
      />
      <Results score={score} attempts={attempts} max={props.attempts}/>
        <GuessGrid>
        {guesses.map((guess, index) => 
          (
            <Guess>{guess.name} | {formatDistance(guess.distance)} | {getDirectionEmoji(guess)}</Guess>
          ))}
        </GuessGrid>
      </CentreWrapper>
    </div>
  );
}

export default App;

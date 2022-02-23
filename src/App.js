import './App.css';
import { useState, useMemo, useEffect } from "react";
import styled from 'styled-components';
import AnswerBox from './AnswerBox';
import { getDistance, getCompassDirection } from "geolib";
import { formatDistance, getDirectionEmoji } from './geography';
import seedrandom from 'seedrandom';
import { DateTime } from "luxon";
import { useGuesses } from './hooks/useGuesses';
import { ToastContainer, Flip } from "react-toastify";
import { EndModal } from "./EndModal";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";


const DELAY_TIME = 0.5;

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
`;

const Grid = styled.div`
  transition: 1s;
  transition-delay: ${DELAY_TIME}s;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  margin-bottom: 1rem;
  grid-gap: ${props => props.end ? "0px" : "2px"};
  z-index: ${props => props.end ? 2 : 1};
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
  transition: 1s;
  transition-delay: ${DELAY_TIME}s;
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
  margin-bottom: 1rem;
  span {
    font-weight: bold;
  }
`;

const Title = styled.div`
  display: block;
  font-size: 4rem;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  span {
    color: #1a76d2;
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
  transition: 1s;
  transition-delay: ${DELAY_TIME}s;
  z-index:${props => props.end ? 2 : -1};
  background: rgba(221,221,221,${props => props.end ? 0.8 : 0});
  font-size: 1.5em;
`;

const Guess = styled.div`
  display:flex; 
  justify-content: end;
  padding: 0.5rem 2rem;
  position: relative;
  background-color: #dddddd;
  border-radius: 3px;
`;

const GuessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: auto 1fr;
  grid-gap: 2px;
  margin-bottom: 1rem;
`;

const ResultsBox = styled.div`
  transition: 1s;
  transition-delay: ${DELAY_TIME}s;
  background: rgba(221,221,221,0.8);
  visibility: ${props => props.end ? "visible" : "hidden"};
  width: 100%;
  p {
    margin: 0.5rem 0.5rem;
  }
  span {
    font-weight: bold;
  }
`;

const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

const getDayString = () => {
  const date = DateTime.now().toFormat("yyyy-MM-dd");
  return `${date}-${DateTime.now().weekday}`;
};

function App(props) {
  const [countryNames, setFlagNames] = useState(() => props.DEBUG ? shuffle(Object.keys(props.countryData)) : Object.keys(props.countryData));
  const [score, setScore] = useState(0);
  const [flippedArray, setFlippedArray] = useState([false, false, false, false, false, false]);
  const [randomOrder, setRandomOrder] = useState(() => shuffle([0,1,2,3,4,5]));
  const [end, setEnd] = useState(false);
  const dayString = useMemo(getDayString, []);
  const [guesses, addGuess] = useGuesses(dayString);
  const trueCountry = useMemo(() => {
    return countryNames[Math.floor(seedrandom.alea(dayString)() * countryNames.length)];
  }, [dayString, countryNames]);

  useEffect(() => {
    if (guesses.length >= props.attempts || guesses[guesses.length - 1]?.distance === 0) {
      setEnd(true);
      setFlippedArray([true, true, true, true, true, true]);
      toast(guesses[guesses.length - 1]?.distance === 0 ? `🎉 ${trueCountry} 🎉` : `🤔 ${trueCountry} 🤔`);
    } 
  }, [guesses]);

  useEffect(() => {
    const lastGuess = guesses[guesses.length - 1];
    lastGuess?.distance === 0 ? setScore(guesses.length) : setScore("DNF");
  }, [guesses]);

  const onIncorrect = () => {
    revealTile();
  };

  const revealTile = () => {
    const [tile] = randomOrder;
    setRandomOrder(randomOrder.length > 1 ? randomOrder.slice(1) : shuffle([0,1,2,3,4,5]));
    const newFlipped = flippedArray.slice();
    newFlipped[tile] = true;
    setFlippedArray(newFlipped);
    return tile;
  };

  const onGuess = guess => {
    const tileNum = revealTile();
    const {code:guessCode, ...guessGeo} = props.countryData[guess];
    const {code:answerCode, ...answerGeo} = props.countryData[trueCountry];
    addGuess({name: guess,
              distance: getDistance(guessGeo, answerGeo),
              direction: getCompassDirection(guessGeo, answerGeo),
              tile: tileNum});
  };

  const countryInfo = props.countryData[trueCountry];

  return (
    <div className='App'>
      <ToastContainer
          hideProgressBar
          position="top-center"
          transition={Flip}
          autoClose={5000}
      />
      <CentreWrapper>
        <Title>FLAG<span>LE</span></Title>
        <Grid end={end}>
          {flippedArray.map((flipped, n) => 
          (
            <Tile key={n} rotate={flipped ? 1 : 0}>
              <TileFront></TileFront>
              <TileBack end={end}><FlagImage
                flag={`https://flagcdn.com/w320/${countryInfo.code}.png`}
                left={`-${(n%3)*64}px`}
                top={`-${Math.floor(n/3)*64}px`}
              >
              </FlagImage></TileBack>
            </Tile>
          ))}
        </Grid>
      <AnswerBox
        answer={trueCountry}
        onCorrect={() => {}}
        onIncorrect={onIncorrect}
        disabled={end}
        countries={Object.keys(props.countryData)}
        onGuess={onGuess}
      />
      <Results score={score} attempts={guesses.length} max={props.attempts}/>
        <GuessGrid>
        {guesses.map((guess, index) => 
          (
            <Guess key={index}>{guess.name} | {formatDistance(guess.distance)} | {getDirectionEmoji(guess)}</Guess>
          ))}
        </GuessGrid>
        <EndModal end={end}
                  score={score} 
                  guesses={guesses}
                  maxAttempts={props.attempts}
        >
        </EndModal>
      </CentreWrapper>
    </div>
  );
}

export default App;

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
const FLAG_WIDTH = 192;
const FLAG_SCALE = FLAG_WIDTH/320;

const CentreWrapper = styled.div`
  margin: 0;
  position: absolute;
  /* overflow: hidden; */
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column; 

  @media (prefers-color-scheme: dark) {
    background-color: #121212;
}
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

const TitleBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  margin-bottom: 1rem;
  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
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
  @media (prefers-color-scheme: dark) {
    background: #121212;
  }
`;

const Tile = styled.div`
  transition: 1s;
  transform-style: preserve-3d;
  display:flex; 
  justify-content: center;
  padding: ${props => props.height ? `${props.height/2}px` : "2rem"} 2rem;
  position: relative;
  transform: ${props => props.rotate ? "rotateY(180deg)" : "rotateY(0deg)"};
`;

const FlagImage = styled.img`
  content: url(${props => props.flag});
  position: relative;
  width: ${FLAG_WIDTH}px;
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
  @media (prefers-color-scheme: dark) {
    color: #fff;
}
`;

const Title = styled.div`
  display: block;
  font-size: 4rem;
  margin-top: 0.5rem;
  span {
    color: #1a76d2;
  }
`;

const Footer = styled.div`
  display: block;
  font-size: 1rem;
  margin-top: auto;
  margin-bottom: 0.5rem;
  span {
    color: #1a76d2;
  }
  @media (prefers-color-scheme: dark) {
    color: #fff;
    a {
      color: #fff
    }
  }
`;

const GuessLine = styled.div`
  display: grid;
  grid-template-columns: repeat(9, minmax(30px, 2.5rem));
  /* grid-template-rows: auto 1fr; */
  margin: 0px 2px 2px 2px;
`;

const CountryGuess = styled.div`
  /* padding: 0.5rem 2rem; */
  display:flex; 
  /* padding-top: 0.3rem; */
  position: relative;
  background-color: #dddddd;
  border-radius: 3px;
  grid-column: 1 / span 6;
  margin-right: 2px;
  text-overflow: ellipsis;
  align-items: center;
  justify-content: center;
  @media (prefers-color-scheme: dark) {
    background-color: #1F2023;
    color: #DADADA
}
`;

const DistanceBox = styled.div`
  display:flex; 
  /* padding-top: 0.3rem; */
  position: relative;
  background-color: #dddddd;
  border-radius: 3px;
  grid-column: 7 / span 2;
  font-weight: bold;
  margin-right: 2px;
  align-items: center;
  justify-content: center;
  @media (prefers-color-scheme: dark) {
    background-color: #1F2023;
    color: #DADADA
}
`;

const ArrowBox = styled.div`
  display:flex; 
  /* padding-top: 0.3rem; */
  padding:0.25rem;
  position: relative;
  background-color: #dddddd;
  border-radius: 3px;
  grid-column: 9 / span 1;
  align-items: center;
  justify-content: center;
  @media (prefers-color-scheme: dark) {
    background-color: #1F2023;
    color: #DADADA
}
`;

const TitleBarDiv = styled.div`
  display: flex;
  align-items: center;
`;

const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

const getDayString = () => {
  const date = DateTime.now().toFormat("yyyy-MM-dd");
  return `${date}-${DateTime.now().weekday}`;
};

function App(props) {
  const [countryNames, setFlagNames] = useState(() => props.DEBUG ? shuffle(Object.keys(props.countryData)) : Object.keys(props.countryData));
  const [score, setScore] = useState("DNF");
  const [flippedArray, setFlippedArray] = useState([false, false, false, false, false, false]);
  const [randomOrder, setRandomOrder] = useState(() => shuffle([0,1,2,3,4,5]));
  const [end, setEnd] = useState(false);
  const dayString = useMemo(getDayString, []);
  const [guesses, addGuess] = useGuesses(dayString);
  const trueCountry = useMemo(() => {
    return countryNames[Math.floor(seedrandom.alea(dayString)() * countryNames.length)];
  }, [dayString, countryNames]);

  useEffect(() => {
    revealTiles();
    getRemainingTiles();
    if (guesses.length >= props.attempts || guesses[guesses.length - 1]?.distance === 0) {
      setEnd(true);
      setFlippedArray([true, true, true, true, true, true]);
      if (guesses[guesses.length - 1].distance === 0) {
        toast(`🎉 ${trueCountry} 🎉`);
        setScore(guesses.lenght);
      } else {
        toast(`🤔 ${trueCountry} 🤔`);
        setScore("DNF");
      }
    } 
  }, [guesses]);

  const onIncorrect = () => {
    revealRandomTile();
  };

  const revealRandomTile = () => {
    const [tile] = randomOrder;
    setRandomOrder(randomOrder.length > 1 ? randomOrder.slice(1) : shuffle([0,1,2,3,4,5]));
    const newFlipped = flippedArray.slice();
    newFlipped[tile] = true;
    setFlippedArray(newFlipped);
    return tile;
  };
  
  const getRemainingTiles = () => {
    const remainingTiles = [];
    const usedTiles = guesses.map(guess => guess.tile);
    for (const i of [0,1,2,3,4,5]) {
        if (!usedTiles.includes(i)) {
          remainingTiles.push(i);
        }
      }
    setRandomOrder(shuffle(remainingTiles));
    return remainingTiles;
  };

  const revealTiles = () => {
    const newFlipped = flippedArray.slice();
    for (const guess of guesses) {
      newFlipped[guess.tile] = true;
      setFlippedArray(newFlipped);
    }
  };

  const onGuess = guess => {
    const tileNum = revealRandomTile();
    const {code:guessCode, ...guessGeo} = props.countryData[guess];
    const {code:answerCode, ...answerGeo} = props.countryData[trueCountry];
    addGuess({name: guess,
              distance: getDistance(guessGeo, answerGeo),
              direction: getCompassDirection(guessGeo, answerGeo),
              tile: tileNum});
  };

  const countryInfo = useMemo(() => props.countryData[trueCountry], [trueCountry]);

  const flagImg = useMemo(() => {
    const img = new Image();
    img.src = `https://flagcdn.com/w320/${countryInfo.code}.png`;
    return img;
  }, [countryInfo]);

  return (
    <div className='App'>
      <ToastContainer
          hideProgressBar
          position="top-center"
          transition={Flip}
          autoClose={5000}
      />
      <CentreWrapper>
        <TitleBar>
          <TitleBarDiv></TitleBarDiv>
          <Title>FLAG<span>LE</span></Title>
          <TitleBarDiv>
          <EndModal end={end}
                    score={score} 
                    guesses={guesses}
                    maxAttempts={props.attempts}
          >
          </EndModal>
          </TitleBarDiv>
        </TitleBar>
        <Grid end={end}>
          {flippedArray.map((flipped, n) => 
          (
            <Tile key={n} rotate={flipped ? 1 : 0} height={FLAG_SCALE*flagImg.height/2}>
              <TileFront></TileFront>
              <TileBack end={end}><FlagImage
                flag={flagImg.src}
                left={`-${(n%3)*64}px`}
                top={`-${Math.floor(n/3)*FLAG_SCALE*flagImg.height/2}px`}
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
        {guesses.map((guess, index) => 
          (
            <GuessLine>
              <CountryGuess>{guess.name}</CountryGuess>
              <DistanceBox>{formatDistance(guess.distance)} </DistanceBox>
              <ArrowBox>{getDirectionEmoji(guess)}</ArrowBox>
            </GuessLine>
          ))}
          <Footer>️❤️ FLAG<span>LE</span>? <a href="https://www.buymeacoffee.com/ryanbarouki">Buy me a ☕👀?</a></Footer>
      </CentreWrapper>
    </div>
  );
}

export default App;

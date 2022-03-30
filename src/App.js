import "./App.css";
import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import AnswerBox from "./AnswerBox";
import seedrandom from "seedrandom";
import { DateTime } from "luxon";
import { useGuesses } from "./hooks/useGuesses";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { FlagGrid } from "./FlagGrid";
import { Guesses } from "./Guesses";

const CentreWrapper = styled.div`
  margin: 0;
  position: absolute;
  overflow: auto;
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

const Attempts = styled(({ score, attempts, max, ...props }) => (
  <div {...props}>
    Attempts:{" "}
    <span>
      {attempts}/{max}
    </span>
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

const Footer = styled.div`
  display: block;
  font-size: 1rem;
  margin-top: auto;
  margin-bottom: 0.5rem;
  span {
    color: #1a76d2;
  }
  p {
    margin-bottom: 0;
    margin-top: 0.25rem;
  }
  @media (prefers-color-scheme: dark) {
    color: #fff;
    a {
      color: #fff;
    }
  }
`;

const TitleBarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justify};
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

const Title = styled.div`
  display: block;
  font-size: 4rem;
  span {
    color: #1a76d2;
  }
`;

const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

const getDayString = () => {
  const date = DateTime.now().toFormat("yyyy-MM-dd");
  return `${date}-${DateTime.now().weekday}`;
};

function App(props) {
  console.log("props", props);
  const [flagNames] = useState(() =>
    props.DEBUG
      ? shuffle(Object.keys(props.flagData))
      : Object.keys(props.flagData)
  );
  const [score, setScore] = useState("DNF");
  const [flippedArray, setFlippedArray] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [randomOrder, setRandomOrder] = useState(() =>
    shuffle([0, 1, 2, 3, 4, 5])
  );
  const [end, setEnd] = useState(false);
  const dayString = useMemo(getDayString, []);
  const [guesses, addGuess] = useGuesses(dayString);
  const trueName = useMemo(() => {
    return flagNames[
      Math.floor(seedrandom.alea(dayString)() * flagNames.length)
    ];
  }, [dayString, flagNames]);
  console.log("TN", trueName);

  useEffect(() => {
    revealTiles();
    getRemainingTiles();
    //console.log("guesses", guesses[guesses.length - 1].name);
    if (
      guesses.length >= props.attempts ||
      (guesses.length >= 1 && guesses[guesses.length - 1].name === trueName)
    ) {
      setEnd(true);
      setFlippedArray([true, true, true, true, true, true]);
      if (guesses[guesses.length - 1].name === trueName) {
        toast(`🎉 ${trueName} 🎉`);
        setScore(guesses.length);
      } else {
        toast(`🤔 ${trueName} 🤔`);
        setScore("DNF");
      }
    }
  }, [guesses]);

  const onIncorrect = () => {
    revealRandomTile();
  };
  const onCorrect = () => {
    revealRandomTile();
  };

  const revealRandomTile = () => {
    const [tile] = randomOrder;
    setRandomOrder(
      randomOrder.length > 1
        ? randomOrder.slice(1)
        : shuffle([0, 1, 2, 3, 4, 5])
    );
    const newFlipped = flippedArray.slice();
    newFlipped[tile] = true;
    setFlippedArray(newFlipped);
    return tile;
  };

  const getRemainingTiles = () => {
    const remainingTiles = [];
    const usedTiles = guesses.map((guess) => guess.tile);
    for (const i of [0, 1, 2, 3, 4, 5]) {
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

  const onGuess = (guess) => {
    const tileNum = revealRandomTile();
    const { code: guessCode } = props.flagData[guess];
    const { code: answerCode } = props.flagData[trueName];
    addGuess({ name: guess, tile: tileNum });
  };

  const prideInfo = useMemo(() => props.flagData[trueName], [trueName]);
  return (
    <div className="App">
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        autoClose={false}
      />
      <CentreWrapper>
        <TitleBar>
          <TitleBarDiv justify="flex-end"></TitleBarDiv>
          <Title>
            PRI<span>DLE</span>
          </Title>
          <TitleBarDiv></TitleBarDiv>
        </TitleBar>
        <FlagGrid
          $end={end}
          prideInfo={prideInfo}
          flippedArray={flippedArray}
        ></FlagGrid>
        <AnswerBox
          answer={trueName}
          onCorrect={() => {}}
          onIncorrect={onIncorrect}
          disabled={end}
          flags={Object.keys(props.flagData)}
          onGuess={onGuess}
        />
        <Attempts
          score={score}
          attempts={guesses.length}
          max={props.attempts}
        />
        <Guesses guesses={guesses} />
        <Footer>"it's like Worldle but gay"</Footer>
      </CentreWrapper>
    </div>
  );
}

export default App;

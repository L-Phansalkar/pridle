import { formatDistance, getDirectionEmoji } from './geography';
import styled from 'styled-components';

const GuessLine = styled.div`
  display: grid;
  grid-template-columns: repeat(9, minmax(30px, 2.5rem));
  margin: 0px 2px 2px 2px;
`;

const CountryGuess = styled.div`
  display:flex; 
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

export function Guesses({ guesses }) {
  return (
    guesses.map((guess, index) =>
      (
        <GuessLine key={index}>
          <CountryGuess>{guess.name}</CountryGuess>
          <DistanceBox>{formatDistance(guess.distance)} </DistanceBox>
          <ArrowBox>{getDirectionEmoji(guess)}</ArrowBox>
        </GuessLine>
      ))
  );
}
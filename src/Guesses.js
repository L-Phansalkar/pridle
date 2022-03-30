import React from "react";
import styled from "styled-components";

const GuessLine = styled.div`
  display: grid;
  grid-template-columns: repeat(9, minmax(30px, 2.5rem));
  margin: 0px 2px 2px 2px;
`;

const IdentityGuess = styled.div`
  display: flex;
  position: relative;
  background-color: #dddddd;
  border-radius: 3px;
  grid-column: 1 / span 6;
  margin-right: 2px;
  text-overflow: ellipsis;
  align-items: center;
  justify-content: center;
  @media (prefers-color-scheme: dark) {
    background-color: #1f2023;
    color: #dadada;
  }
`;

export function Guesses({ guesses }) {
  return guesses.map((guess, index) => (
    <GuessLine key={index}>
      <IdentityGuess>{guess.name}</IdentityGuess>
    </GuessLine>
  ));
}

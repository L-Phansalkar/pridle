import React, { useState } from "react";
import Select, { defaultTheme } from 'react-select';
import styled from "styled-components";

const normalise = value => value.toUpperCase();
const StyledSelect = styled(Select)`
  font-family: Courier, monospace;
  margin-bottom: 1rem;
  min-width: 200px;
  color: #000;
  :hover{
    border-color: #123456;
  }
`;

const AnswerBox = ({ answer, onCorrect, onIncorrect, disabled, countries, onGuess, ...props }) => {
  const handleSubmit = guess => {
      normalise(guess.value) === normalise(answer) ? onCorrect() : onIncorrect();
      onGuess(guess.value);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: 52,
        border: '1px solid #23b21a',
        boxShadow: '0px 0px 3px #23b21a',
      '&:hover': {
        border: '1px solid #23b21a',
        boxShadow: '0px 0px 3px #23b21a',
      },
      '&:focus': {
        border: '1px solid #23b21a',
        boxShadow: '0px 0px 3px #23b21a',
      },
    }),
  };

  return (
    <StyledSelect
      options={countries.map(val => ({label: val, value: val }))} 
      onChange={handleSubmit}
      placeholder="Guess the flag!"
      isOptionDisabled={() => disabled}
    />
  );
};

export default AnswerBox;
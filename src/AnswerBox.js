import React, { useState, useEffect, useMemo } from "react";
import Select from 'react-select';
import styled from "styled-components";

const normalise = value => value.toUpperCase();
const StyledSelect = styled(Select)`
  font-family: Courier, monospace;
  margin-bottom: 0.5rem;
  :hover{
    border-color: #123456;
  }
`;

export default ({ answers, onCorrect, onIncorrect, disabled, countries, ...props }) => {
  const [filteredData, setFilteredData] = useState(countries.map(country => Array.isArray(country) ? country[0] : country));

  const handleSubmit = guess => {
    answers = Array.isArray(answers) ? answers : [answers]
    for (const answer of answers) {
      if (normalise(guess.value) !== normalise(answer)) {
        onIncorrect();
      } else {
        onCorrect();
        break;
      }
    } 
    return;
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
      options={filteredData.map(val => ({label: val, value: val }))} 
      onChange={handleSubmit}
      placeholder="Guess the flag!"
      autoFocus
      styles={customStyles}
    />
  );
};
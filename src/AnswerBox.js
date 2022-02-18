import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";

const normalise = value => value.toUpperCase();

const Form = styled.form`
  margin-bottom: 1em;
`;

const Placeholder = styled.span`
  font-family: Courier, monospace;
  padding: 0 0.1em 0.1em 0.2em;
  font-size: 2rem;
  letter-spacing: 0.1rem; 
  border: 1px solid #000;
  border-radius: 3px;
`;

const HiddenInput = styled.input`
  opacity: 0;
  position: absolute;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  caret-color: transparent;
  &:focus + ${Placeholder} {
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
  }
`;

export default ({ answers, onCorrect, onIncorrect, ...props }) => {
  const [value, setValue] = useState("");

  useEffect(() => setValue(""), [answers]);

  const handleChange = event => {
    setValue(normalise(event.target.value));
  };

  answers = Array.isArray(answers) ? answers : [answers]
  const handleSubmit = event => {
    event.preventDefault();

    for (const answer of answers) {
      if (value !== normalise(answer)) {
        onIncorrect();
      } else {
        onCorrect();
        break;
      }
    } 
        setValue("");
        return;
  };

  const placeholder = useMemo(() => value === "" ? "GUESS THE FLAG" : value, [
    value
  ]);


  return (
    <Form onSubmit={handleSubmit}>
      <HiddenInput
        onChange={handleChange}
        value={value}
        autoFocus
      />
      <Placeholder>{placeholder}</Placeholder>
    </Form>
  );
};
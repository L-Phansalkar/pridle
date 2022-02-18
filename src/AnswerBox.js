import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";

const normalise = value => value.toUpperCase();

const Form = styled.form`
  margin-bottom: 1em;
`;

const Placeholder = styled.span`
  font-family: monospace, monospace;
  padding: 0 0 0.2em 0.2em;
  font-size: 2em;
  letter-spacing: 0.2em;
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

export default ({ answer, onCorrect, onIncorrect, ...props }) => {
  const [value, setValue] = useState("");

  useEffect(() => setValue(""), [answer]);

  const handleChange = event => {
    setValue(normalise(event.target.value));
  };

  const handleSubmit = event => {
    event.preventDefault();

    value === normalise(answer) ? onCorrect() : onIncorrect();
    setValue("");
    return;
  };

  const placeholder = useMemo(() => value === "" ? "GUESS THE COUNTRY" : value, [
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
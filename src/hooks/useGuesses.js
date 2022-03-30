import React, { useCallback, useState } from "react";
import { loadAllGuesses, saveGuesses } from "../savelocal";

export function useGuesses(dayString) {
  const [guesses, setGuesses] = useState(loadAllGuesses()[dayString] ?? []);
  const addGuess = useCallback(
    (newGuess) => {
      const newGuesses = [...guesses, newGuess];
      setGuesses(newGuesses);
      saveGuesses(dayString, newGuesses);
    },
    [dayString, guesses]
  );

  return [guesses, addGuess];
}

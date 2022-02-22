import { useCallback, useState } from "react";
import { loadAllGuesses, saveGuesses } from "../save_local";

export function useGuesses(dayString) { 
  const [guesses, setGuesses] = useState(loadAllGuesses()[dayString] ?? []);

  const addGuess = useCallback(newGuess => {
      const newGuesses = [...guesses, newGuess];
      setGuesses(newGuesses);
      saveGuesses(dayString, newGuesses);
    },
    [dayString, guesses]
  );

  return [guesses, addGuess];
}

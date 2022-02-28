import CopyToClipboard from "react-copy-to-clipboard";
import React, { useMemo } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from '@mui/material/Button';

const generateShareSquares = (score, guesses, attempts) => {
    if (score === "DNF") {
      return "🟥🟥🟥\n🟥🟥🟥\n"
    }
    let squares = Array(attempts).fill("🟩");
    for (let i = 0; i < guesses.length - 1; i++) {
        squares[guesses[i].tile] = "🟥";
    }

    for (let i = 0; i < attempts; i++) {
        if ((i+1) % 3 === 0) {
            squares[i] += "\n";
        }
    } 
    return squares.join("");
}
const ShareButton = styled.button`
  background-color: #23b21a; 
  border: none;
  color: white;
  border-radius: 3px;
  padding: 15px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  font-family: Courier, monospace;
  font-weight: bold;
  margin-bottom: 0.5rem;
  cursor: pointer;

  :hover {
    background-color: #1c8116;
  }
`;


export function Share({ score, guesses, attempts, end}) {
  const shareText = useMemo(() => {
    const squareString = generateShareSquares(score, guesses, attempts);
    return `#Flagle ${score === "DNF" ? "X" : guesses.length}/${attempts}\n${squareString}https://www.flagle.io`
  }, [guesses, attempts]);

  return (
    <CopyToClipboard
      text={shareText}
      onCopy={() => toast("Copied Results to Clipboard")}
      options={{ format: "text/plain" }}
    >
      <Button variant="contained" disabled={end ? 0 : 1}><span>Share Score</span></Button>
    </CopyToClipboard>
  )
}
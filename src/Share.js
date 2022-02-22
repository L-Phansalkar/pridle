import CopyToClipboard from "react-copy-to-clipboard";
import React, { useMemo } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

const generateShareSquares = (guesses, attempts) => {
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
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-family: Courier, monospace;
  font-weight: bold;
  margin-bottom: 1rem;
  cursor: pointer;

  :hover {
    background-color: #1c8116;
  }
`;

export function Share({ score, guesses, attempts }) {
  const shareText = useMemo(() => {
    const squareString = generateShareSquares(guesses, attempts);
    return `Flagle ${guesses.length}/${attempts}\n${squareString}`
  }, [guesses, attempts]);

  return (
    <CopyToClipboard
      text={shareText}
      onCopy={() => toast("Copied Results to Clipboard")}
      options={{ format: "text/plain" }}
    >
      <ShareButton>
        Share Score
      </ShareButton>
    </CopyToClipboard>
  )
}
const DIRECTION_ARROWS = {
  N: "⬆️",
  NNE: "↗️",
  NE: "↗️",
  ENE: "↗️",
  E: "➡️",
  ESE: "↘️",
  SE: "↘️",
  SSE: "↘️",
  S: "⬇️",
  SSW: "↙️",
  SW: "↙️",
  WSW: "↙️",
  W: "⬅️",
  WNW: "↖️",
  NW: "↖️",
  NNW: "↖️",
};

export function getDirectionEmoji(guess) {
  return guess.distance === 0 ? "🎉" : DIRECTION_ARROWS[guess.direction];
}

export function formatDistance(distance) {
    return `${Math.round(distance/1000)}km`
}
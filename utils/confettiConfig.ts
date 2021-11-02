import { ConfettiConfig } from "react-dom-confetti";

// From https://daniel-lundin.github.io/react-dom-confetti/
export const confettiConfig: ConfettiConfig = {
  angle: 90,
  spread: 100,
  startVelocity: 34,
  elementCount: 81,
  dragFriction: 0.11,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

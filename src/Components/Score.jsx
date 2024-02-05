import react, { useState } from "react";

export default function Score({ score, totalQuestions }) {
  return (
    <div>
      <h2 className="score-h2" >Score: {score}/{totalQuestions}</h2>
    </div>
  );
}

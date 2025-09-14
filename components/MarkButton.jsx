"use client";
import React from "react";

const MarkButton = ({
  markLogo,
  checkMark,
  currQues,
  setCurrQues,
  totalQues,
  setScore,
  score,
}) => {
  const addNumAndScore = () => {
    setCurrQues(currQues + 1);

    if (checkMark) {
      setScore(score + 1);
    }
  };

  return (
    <button
      className="rounded-4xl border-2 w-20 h-20 hover:bg-white"
      onClick={() => addNumAndScore()}
    >
      <div className="text-2xl">{markLogo}</div>
    </button>
  );
};

export default MarkButton;

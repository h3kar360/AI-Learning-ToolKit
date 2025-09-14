"use client";
import React, { useState } from "react";
import MarkButton from "./MarkButton";

const FlashCardsCard = ({ currQues, totalQues, flashCard, setCurrQues }) => {
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <div>
      {currQues + 1 <= totalQues ? (
        <div
          className="flex flex-col w-200 h-120 rounded-2xl border-2 relative"
          onClick={() => setFlipped(!flipped)}
        >
          <div className="absolute top-5 w-full text-center">{`${
            currQues + 1
          }/${totalQues}`}</div>
          <div className="flex flex-1 justify-center items-center text-center text-2xl p-10 h-full">
            {flipped ? flashCard?.answer : flashCard?.question}
          </div>
          {flipped ? (
            <div className="absolute bottom-5 flex w-full px-10 justify-between items-center pb-10 z-10">
              <MarkButton
                markLogo={"✔️"}
                checkMark={true}
                currQues={currQues}
                setCurrQues={setCurrQues}
                setScore={setScore}
                score={score}
              />
              <MarkButton
                markLogo={"✖️"}
                checkMark={false}
                currQues={currQues}
                setCurrQues={setCurrQues}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className=" flex flex-col text-center text-5xl h-full items-center justify-center gap-3">
          <div>You Scored:</div>
          <div>{`${score}/${totalQues}`}</div>
        </div>
      )}
    </div>
  );
};

export default FlashCardsCard;

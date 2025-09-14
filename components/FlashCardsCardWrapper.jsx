"use client";
import React, { useState } from "react";
import FlashCardsCard from "./FlashCardsCard";

const FlashCardsCardWrapper = ({ flashCardList }) => {
  const [currQues, setCurrQues] = useState(0);

  return (
    <div>
      <FlashCardsCard
        currQues={currQues}
        setCurrQues={setCurrQues}
        totalQues={flashCardList.flashCards.length}
        flashCard={flashCardList.flashCards[currQues]}
      />
    </div>
  );
};

export default FlashCardsCardWrapper;

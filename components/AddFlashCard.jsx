"use client";
import React from "react";

const AddFlashCard = ({ startCreating, setStartCreating }) => {
  return (
    <button
      className={
        startCreating
          ? "rounded-2xl py-2 bg-red-500 w-full hover:bg-red-400"
          : "rounded-2xl py-2 bg-blue-600 w-full hover:bg-blue-500"
      }
      onClick={() => setStartCreating(!startCreating)}
    >
      {startCreating ? "cancel" : "create flash card"}
    </button>
  );
};

export default AddFlashCard;

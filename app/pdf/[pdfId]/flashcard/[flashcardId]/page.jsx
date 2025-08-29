import React from "react";

const page = async ({ params }) => {
  const { flashcardId } = await params;

  return (
    <div>
      <div>{flashcardId}</div>
    </div>
  );
};

export default page;

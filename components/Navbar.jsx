import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <nav className="flex items-center bg-black border-b-2 fixed h-20 inset-x-0 z-100">
        <div className="px-10 text-2xl">
          <Link href="/">AI Learning Toolkit</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

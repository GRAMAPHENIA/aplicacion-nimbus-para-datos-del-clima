"use client";

import type { NextPage } from "next";
import Weather from "@/components/customs/Weather";

const Home: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <div className=" flex justify-center items-center m-auto ">
        <Weather />
      </div>
    </main>
  );
};

export default Home;

import React, { createContext, use, useState } from 'react';

// 1️⃣ Create Context
export const GlobalContext = createContext();

// 2️⃣ Provider component
export const GlobalProvider = ({ children }) => {
  const [generation, setGeneration] = useState(0);
  const [unit , setUnit] = useState("");
  const [globalTag  ,setGlobalTag] = useState("");

  return (
    <GlobalContext.Provider value={{ generation, setGeneration, unit, setUnit, globalTag, setGlobalTag }}>
      {children}
    </GlobalContext.Provider>
  );
};

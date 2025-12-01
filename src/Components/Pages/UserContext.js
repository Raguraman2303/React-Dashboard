import { createContext, useState } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [lastName, setLastName] = useState("Ramasubbu");

  return (
    <UserContext.Provider value={{ lastName, setLastName }}>
      {children}
    </UserContext.Provider>
  );
};

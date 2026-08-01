import { useContext } from "react";
import { BrigadeContext } from "../context/BrigadeContext";

export const useBrigade = () => {
  const context = useContext(BrigadeContext);
  
  if (!context) {
    throw new Error("useBrigade debe ser usado dentro de un BrigadeProvider");
  }
  
  return context;
};
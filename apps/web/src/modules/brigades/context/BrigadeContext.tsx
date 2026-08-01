import { createContext } from 'react';
import type { BrigadeContextType } from '../types/brigade.types';

export const BrigadeContext = createContext<BrigadeContextType | undefined>(undefined);
import React from 'react';
import { BrigadeProvider } from '@modules/brigades/context/BrigadeProvider';
import { BrigadistLayout } from './layout';

export const BrigadistPanel: React.FC = () => {
  return (
    <BrigadeProvider>
      <BrigadistLayout />
    </BrigadeProvider>
  );
};

export default BrigadistPanel;
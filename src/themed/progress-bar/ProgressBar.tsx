import { Box } from '@mui/material';
import React from 'react';
import Text from '../text/Text';

export interface ProgressBarProps {
  label: string;
  progress: number;
  color: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, progress, color }) => {
  return (
    <Box className="flex-col items-start mb-4">
      <Box className="flex flex-row justify-between">
        <Text className="text-gray-800 font-medium mr-4 mb-2">{label}</Text>
        <Text className="text-gray-800 font-medium ml-4">{progress}</Text>
      </Box>
      <Box className="flex-row items-center">
        <Box className="relative w-11/12 rounded-full h-2" style={{ width: '100%' }}>
          <Box
            className={`absolute top-0 left-0 h-full rounded-full bg-${color} opacity-30`}
            style={{ width: `100%` }}
          />
          <Box className={`absolute top-0 left-0 h-full rounded-full bg-${color}`} style={{ width: `${progress}%` }} />
        </Box>
      </Box>
    </Box>
  );
};

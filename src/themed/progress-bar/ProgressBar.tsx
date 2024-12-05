import { Box, Tooltip } from '@mui/material';
import React from 'react';
import Text from '../text/Text';
import Help from '@/assets/icons/help.svg';

export interface ProgressBarProps {
  label: string;
  progress: number;
  value: number;
  color: string;
  tooltip?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, progress, color, tooltip }) => {
  return (
    <Box className="flex-col items-start mb-4">
      <Box className="flex flex-row justify-between">
        <Box className="flex">
          <Text className="text-gray-800 font-medium mr-2 mb-0">{label}</Text>
          {tooltip && (
            <Tooltip title={tooltip} placement="top">
              <img className="self-start mt-1" src={Help} alt="help" width="18" />
            </Tooltip>
          )}
        </Box>
        <Text className="text-gray-800 font-medium ml-4">{value}</Text>
      </Box>
      <Box className="flex-row items-center">
        <Box className="relative w-11/12 rounded-full h-2" style={{ width: '100%' }}>
          <Box className={`absolute top-0 left-0 h-full rounded-full ${color} opacity-30`} style={{ width: `100%` }} />
          <Box className={`absolute top-0 left-0 h-full rounded-full ${color}`} style={{ width: `${progress}%` }} />
        </Box>
      </Box>
    </Box>
  );
};

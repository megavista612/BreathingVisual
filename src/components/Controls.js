import React from 'react';
import { Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { PlayArrow as PlayArrowIcon, 
         Pause as PauseIcon, 
         Stop as StopIcon, 
         VolumeUp as VolumeUpIcon, 
         VolumeOff as VolumeOffIcon } from '@mui/icons-material';

const Controls = ({
  isRunning,
  isPaused,
  isMuted,
  onStart,
  onPause,
  onStop,
  onMute,
  duration,
  setDuration,
  theme,
  setTheme,
  music,
  setMusic
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={isRunning && !isPaused ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={isRunning && !isPaused ? onPause : onStart}
        >
          {isRunning && !isPaused ? 'Pause' : 'Start'}
        </Button>
        <Button
          variant="contained"
          startIcon={<StopIcon />}
          onClick={onStop}
          disabled={!isRunning && !isPaused}
        >
          Stop
        </Button>
        <Button
          variant="contained"
          startIcon={isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          onClick={onMute}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Duration (s)</InputLabel>
          <Select
            value={duration}
            label="Duration (s)"
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Theme</InputLabel>
          <Select
            value={theme}
            label="Theme"
            onChange={(e) => setTheme(e.target.value)}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="green-purple">Green/Purple</MenuItem>
            <MenuItem value="red-yellow">Red/Yellow</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Music</InputLabel>
          <Select
            value={music}
            label="Music"
            onChange={(e) => setMusic(e.target.value)}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="river">River</MenuItem>
            <MenuItem value="gong">Gong</MenuItem>
            <MenuItem value="harp">Harp</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Controls;
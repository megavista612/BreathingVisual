import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Controls from './Controls';
import BoxComponent from './Box';
import Summary from './Summary';

const BoxBreathing = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(4);
  const [theme, setTheme] = useState('default');
  const [music, setMusic] = useState('none');
  const [breathCount, setBreathCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const startTimeRef = useRef(null);
  const pauseTimeRef = useRef(null);
  const cycleCountRef = useRef(0);

  useEffect(() => {
    if (isRunning && !isPaused) {
      setIsReady(true);
      const timer = setTimeout(() => {
        setIsReady(false);
        setStartTime(performance.now());
        startTimeRef.current = performance.now();
      }, 2500); // Increased to 2.5 seconds (1 second fade in, 1.5 seconds display)
      return () => clearTimeout(timer);
    } else {
      setStartTime(null);
      setIsReady(false);
    }
  }, [isRunning, isPaused]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      const intervalId = setInterval(() => {
        cycleCountRef.current += 1;
        if (cycleCountRef.current % 4 === 0) {
          setBreathCount(prevCount => prevCount + 1);
        }
      }, duration * 1000);
      return () => clearInterval(intervalId);
    }
  }, [isRunning, isPaused, duration]);

  const handleStart = () => {
    if (isPaused) {
      const now = performance.now();
      setStartTime(now - pauseTimeRef.current);
      startTimeRef.current = now - pauseTimeRef.current;
      setIsPaused(false);
    } else {
      setIsReady(true);
      setTimeout(() => {
        setIsReady(false);
        setStartTime(performance.now());
        startTimeRef.current = performance.now();
      }, 2500); // Increased to 2.5 seconds
      cycleCountRef.current = 0;
      setBreathCount(0);
    }
    setIsRunning(true);
    setShowSummary(false);
  };

  const handlePause = () => {
    pauseTimeRef.current = performance.now() - startTimeRef.current;
    setIsPaused(true);
  };

  const handleStop = () => {
    if (isRunning || isPaused) {
      setIsRunning(false);
      setIsPaused(false);
      setTotalTime(Math.floor((performance.now() - startTimeRef.current) / 1000));
      setStartTime(null);
      startTimeRef.current = null;
      setShowSummary(true);
      setDuration(prevDuration => prevDuration);
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    // Implement actual audio muting here
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <BoxComponent
        isRunning={isRunning}
        duration={duration}
        theme={theme}
        startTime={startTime}
        isReady={isReady}
        key={startTime}
      />
      <Controls
        isRunning={isRunning}
        isPaused={isPaused}
        isMuted={isMuted}
        onStart={handleStart}
        onPause={handlePause}
        onStop={handleStop}
        onMute={handleMute}
        duration={duration}
        setDuration={setDuration}
        theme={theme}
        setTheme={setTheme}
        music={music}
        setMusic={setMusic}
      />
      {showSummary && (
        <Summary
          totalTime={totalTime}
          breathCount={breathCount}
          onClose={() => setShowSummary(false)}
        />
      )}
    </Box>
  );
};

export default BoxBreathing;
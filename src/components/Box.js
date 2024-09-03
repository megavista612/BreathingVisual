import React, { useEffect, useRef, useState } from 'react';
import { Box as MUIBox, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
`;

const RelaxingText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontSize: '32px',
  fontStyle: 'italic',
  opacity: 0,
  transition: 'opacity 0.5s ease-in-out',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  textAlign: 'center',
  color: 'grey',
  lineHeight: 1.2,
}));

const PulsatingDot = styled('div')(({ color }) => ({
  width: '26px',
  height: '26px',
  backgroundColor: color,
  position: 'absolute',
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: color,
    borderRadius: '50%',
    zIndex: -1,
    opacity: 0.7,
  },
  '&::before': {
    animation: `${pulse} 2s ease-out infinite`,
  },
  '&::after': {
    animation: `${pulse} 2s 1s ease-out infinite`,
  },
}));

const PhaseText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontSize: '40px',
  fontStyle: 'italic',
  opacity: 0,
  transition: 'opacity 0.5s ease-in-out',
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  textAlign: 'center',
}));

const CountdownText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontSize: '24px',
  fontStyle: 'italic',
  opacity: 0,
  transition: 'opacity 0.5s ease-in-out',
  position: 'absolute',
  bottom: '30%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  textAlign: 'center',
  color: 'grey',
}));

const InstructionText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontSize: '24px',
  fontStyle: 'italic',
  opacity: 1,
  transition: 'opacity 0.5s ease-in-out',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  textAlign: 'center',
  color: 'grey',
  lineHeight: 1.2,
}));

const Box = ({ isRunning, duration, theme, startTime, isReady }) => {
  const [showInstruction, setShowInstruction] = useState(true);
  const boxRef = useRef(null);
  const dotRef = useRef(null);
  const phaseTextRef = useRef(null);
  const countdownRef = useRef(null);
  const readyTextRef = useRef(null);

  const phases = ['Exhale', 'Hold', 'Inhale', 'Hold'];
  const points = [
    { x: 300, y: 0 },   // A: Upper right
    { x: 300, y: 300 }, // B: Lower right
    { x: 0, y: 300 },   // C: Lower left
    { x: 0, y: 0 }      // D: Upper left
  ];

  const getColors = () => {
    switch (theme) {
      case 'green-purple':
        return { color1: '#4CAF50', color2: '#9C27B0' };
      case 'red-yellow':
        return { color1: '#FFEB3B', color2: '#F44336' };
      default:
        return { color1: '#FF9800', color2: '#2196F3' }; // Orange to Blue
    }
  };

  useEffect(() => {
    if (isRunning) {
      setShowInstruction(false);
    }
  }, [isRunning]);

  useEffect(() => {
    if (isReady) {
      if (readyTextRef.current) {
        readyTextRef.current.style.opacity = '1';
        setTimeout(() => {
          if (readyTextRef.current) {
            readyTextRef.current.style.opacity = '0';
          }
        }, 2000);
      }
      if (boxRef.current) {
        boxRef.current.style.borderColor = getColors().color1;
      }
      if (dotRef.current) {
        dotRef.current.style.left = '287px';
        dotRef.current.style.top = '-13px';
        dotRef.current.style.setProperty('--dot-color', getColors().color1);
      }
    } else if (isRunning && startTime) {
      const animate = (timestamp) => {
        const elapsedTime = timestamp - startTime;
        const totalCycleDuration = duration * 4 * 1000;
        const cycleTime = elapsedTime % totalCycleDuration;
        const phaseIndex = Math.floor(cycleTime / (duration * 1000));
        const phaseTime = cycleTime % (duration * 1000);

        const safePhaseIndex = phaseIndex % 4;

        const startPoint = points[safePhaseIndex];
        const endPoint = points[(safePhaseIndex + 1) % 4];

        if (!startPoint || !endPoint) {
          console.error('Invalid points:', startPoint, endPoint);
          return;
        }

        const progress = phaseTime / (duration * 1000);

        const pauseDuration = 200;
        let adjustedProgress = progress;
        if (progress < pauseDuration / (duration * 1000)) {
          adjustedProgress = 0;
        } else if (progress > 1 - pauseDuration / (duration * 1000)) {
          adjustedProgress = 1;
        } else {
          adjustedProgress = (progress - pauseDuration / (duration * 1000)) / (1 - 2 * pauseDuration / (duration * 1000));
        }

        const x = startPoint.x + (endPoint.x - startPoint.x) * adjustedProgress;
        const y = startPoint.y + (endPoint.y - startPoint.y) * adjustedProgress;

        const originalSize = 300;
        const minSize = originalSize * 0.75;
        let currentSize;

        if (safePhaseIndex === 0) {
          currentSize = originalSize - (originalSize - minSize) * adjustedProgress;
        } else if (safePhaseIndex === 1) {
          currentSize = minSize;
        } else if (safePhaseIndex === 2) {
          currentSize = minSize + (originalSize - minSize) * adjustedProgress;
        } else {
          currentSize = originalSize;
        }

        if (boxRef.current) {
          boxRef.current.style.width = `${currentSize}px`;
          boxRef.current.style.height = `${currentSize}px`;
        }

        const scale = currentSize / originalSize;
        const { color1, color2 } = getColors();
        let color;
        if (safePhaseIndex === 0) {
          color = interpolateColor(color1, color2, adjustedProgress);
        } else if (safePhaseIndex === 1) {
          color = color2;
        } else if (safePhaseIndex === 2) {
          color = interpolateColor(color2, color1, adjustedProgress);
        } else {
          color = color1;
        }

        if (dotRef.current) {
          dotRef.current.style.left = `${(x * scale) - 13}px`;
          dotRef.current.style.top = `${(y * scale) - 13}px`;
          dotRef.current.style.setProperty('--dot-color', color);
        }

        if (boxRef.current) {
          boxRef.current.style.borderColor = color;
        }

        if (phaseTextRef.current) {
          const currentPhase = phases[safePhaseIndex];
          if (phaseTextRef.current.textContent !== currentPhase) {
            phaseTextRef.current.style.opacity = '0';
            setTimeout(() => {
              if (phaseTextRef.current) {
                phaseTextRef.current.textContent = currentPhase;
                phaseTextRef.current.style.opacity = '1';
                phaseTextRef.current.style.color = color;
              }
            }, 250);
          } else {
            phaseTextRef.current.style.color = color;
          }
        }

        if (countdownRef.current) {
          const countdown = Math.max(0, Math.ceil((duration * 1000 - phaseTime) / 1000));
          if (countdownRef.current.textContent !== countdown.toString()) {
            countdownRef.current.style.opacity = '0';
            setTimeout(() => {
              if (countdownRef.current) {
                countdownRef.current.textContent = countdown;
                countdownRef.current.style.opacity = '1';
              }
            }, 250);
          }
        }

        requestAnimationFrame(animate);
      };

      const animationId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationId);
      };
    } else {
      if (boxRef.current) {
        boxRef.current.style.width = '300px';
        boxRef.current.style.height = '300px';
      }
      if (dotRef.current) {
        dotRef.current.style.left = '287px';
        dotRef.current.style.top = '-13px';
        dotRef.current.style.setProperty('--dot-color', getColors().color1);
      }
      if (phaseTextRef.current) {
        phaseTextRef.current.textContent = '';
        phaseTextRef.current.style.opacity = '0';
        phaseTextRef.current.style.color = getColors().color1;
      }
      if (countdownRef.current) {
        countdownRef.current.textContent = '';
        countdownRef.current.style.opacity = '0';
      }
    }
  }, [isRunning, duration, theme, startTime, isReady]);

  const interpolateColor = (color1, color2, factor) => {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const boxStyle = {
    width: '100%',
    height: '100%',
    border: '2px solid #000',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <MUIBox sx={{ position: 'relative', width: 300, height: 300, margin: '20px auto' }}>
      <div ref={boxRef} style={boxStyle}>
        <PulsatingDot ref={dotRef} color="var(--dot-color)" />
        <PhaseText ref={phaseTextRef}></PhaseText>
        <CountdownText ref={countdownRef}></CountdownText>
        {showInstruction && (
          <InstructionText>
            Exhale, hold, inhale, and hold again, each for {duration} seconds
          </InstructionText>
        )}
      </div>
      <RelaxingText ref={readyTextRef}>
        Ready<br />to<br />exhale
      </RelaxingText>
    </MUIBox>
  );
};

export default Box;
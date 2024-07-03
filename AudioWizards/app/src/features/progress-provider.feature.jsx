// src/contexts/progress.context.js
import React, { createContext, useState, useEffect } from 'react';
import { loadProgress, resetProgress, saveProgress } from '../infrastructure/storage';

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({
    metrics: [],
    food: 0,
    sleep: 0,
    clean: 0,
    coins: 0,
    emotionsStats: { happy: 0, annoyed: 0, fearful: 0, dead: 0 },
  });
  const [hasProgressLoaded, setHasProgressLoaded] = useState(false);

  useEffect(() => {
    const initializeProgress = async () => {
      const progressData = await loadProgress();
      setProgress(progressData);
      setHasProgressLoaded(true);
    };

    initializeProgress();
  }, []);

  const updateMetrics = async (newMetrics) => {
    const updatedMetrics = [...progress.metrics, ...newMetrics];
    if (updatedMetrics.length > 10000) {
      updatedMetrics.splice(0, updatedMetrics.length - 10000);
    }

    const updatedProgress = {
      ...progress,
      metrics: updatedMetrics,
    };

    setProgress(updatedProgress);

    // Save to AsyncStorage
    await saveProgress(
      updatedProgress.metrics,
      updatedProgress.food,
      updatedProgress.sleep,
      updatedProgress.clean,
      updatedProgress.coins,
      updatedProgress.emotionsStats
    );
  };

  const updateParams = async (params) => {
    const updatedProgress = {
      ...progress,
      ...params,
    };

    setProgress(updatedProgress);

    // Save to AsyncStorage
    await saveProgress(
      updatedProgress.metrics,
      updatedProgress.food,
      updatedProgress.sleep,
      updatedProgress.clean,
      updatedProgress.coins,
      updatedProgress.emotionsStats
    );
  };

  return (
    <ProgressContext.Provider
      value={{ progress, hasProgressLoaded, updateMetrics, updateParams }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

// components/ScoreDisplay.tsx
'use client';

import React from 'react';

interface ScoreDisplayProps {
  scoreAr: string;
  scoreEn: string;
  score: number;
  maxScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ scoreAr, scoreEn, score, maxScore }) => {
  return (
    <div className="my-4 p-4 bg-gray-100 rounded">
      <p className="text-lg font-semibold" dir="rtl">
        {scoreAr}: {score}/{maxScore}
      </p>
      <p className="text-lg font-semibold">
        {scoreEn}: {score}/{maxScore}
      </p>
    </div>
  );
};

export default ScoreDisplay;

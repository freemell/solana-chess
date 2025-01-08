import React from 'react';
import { Brain } from 'lucide-react';

interface DifficultySelectorProps {
  currentLevel: number;
  onLevelChange: (level: number) => void;
  disabled?: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  currentLevel, 
  onLevelChange,
  disabled 
}) => {
  const levels = [
    { value: 1, label: 'Beginner' },
    { value: 3, label: 'Intermediate' },
    { value: 5, label: 'Advanced' },
    { value: 8, label: 'Master' }
  ];

  return (
    <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3 float-effect">
      <Brain className="w-6 h-6 text-[#14F195]" />
      <select
        value={currentLevel}
        onChange={(e) => onLevelChange(Number(e.target.value))}
        disabled={disabled}
        className="bg-transparent text-[#14F195] font-medium outline-none cursor-pointer disabled:cursor-not-allowed transition-colors hover:text-[#9945FF]"
      >
        {levels.map((level) => (
          <option 
            key={level.value} 
            value={level.value}
            className="bg-[#1a2b22] text-[#14F195]"
          >
            {level.label} (Rating: {800 + level.value * 200})
          </option>
        ))}
      </select>
    </div>
  );
};
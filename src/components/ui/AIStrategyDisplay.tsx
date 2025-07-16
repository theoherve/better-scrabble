import React from 'react';

interface AIStrategyDisplayProps {
  strategy?: string;
  isVisible: boolean;
}

const AIStrategyDisplay: React.FC<AIStrategyDisplayProps> = ({ strategy, isVisible }) => {
  if (!isVisible || !strategy) return null;

  const getStrategyIcon = (strategy: string) => {
    if (strategy.includes('Bingo')) return '🎯';
    if (strategy.includes('Bonus')) return '⭐';
    if (strategy.includes('Extension')) return '🔗';
    if (strategy.includes('connexions')) return '🔗';
    return '🤖';
  };

  const getStrategyColor = (strategy: string) => {
    if (strategy.includes('Bingo')) return 'text-yellow-600 bg-yellow-100';
    if (strategy.includes('Bonus')) return 'text-purple-600 bg-purple-100';
    if (strategy.includes('Extension')) return 'text-blue-600 bg-blue-100';
    if (strategy.includes('connexions')) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`px-4 py-2 rounded-lg shadow-lg border ${getStrategyColor(strategy)}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStrategyIcon(strategy)}</span>
          <div>
            <div className="font-semibold text-sm">IA Stratégie</div>
            <div className="text-xs">{strategy}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStrategyDisplay; 
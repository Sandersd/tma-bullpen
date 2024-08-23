import React from 'react';

type Range = '1D' | '1W' | '1M';

interface RangeSelectorProps {
  selectedRange: Range;
  onRangeChange: (range: Range) => void;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({ selectedRange, onRangeChange }) => {
  const ranges: Range[] = ['1D', '1W', '1M'];

  return (
    <div className="flex justify-center space-x-2 my-4">
      {ranges.map((range) => (
        <button
          key={range}
          className={`px-4 py-2 rounded-full ${
            selectedRange === range
              ? 'bg-green-500 text-white'
              : 'text-gray-700'
          }`}
          onClick={() => onRangeChange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  );
};

export default RangeSelector;
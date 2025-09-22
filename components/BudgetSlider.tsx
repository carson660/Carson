'use client';

import { useState } from 'react';

import { formatCurrency } from '@/lib/utils';

type Props = {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
};

export function BudgetSlider({ min, max, onChange }: Props) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  const handleMinChange = (value: number) => {
    setLocalMin(value);
    onChange(value, localMax);
  };

  const handleMaxChange = (value: number) => {
    setLocalMax(value);
    onChange(localMin, value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{formatCurrency(localMin)}</span>
        <span>{formatCurrency(localMax)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={localMax}
        step={100}
        value={localMin}
        onChange={(event) => handleMinChange(Number(event.target.value))}
      />
      <input
        type="range"
        min={localMin}
        max={20000}
        step={100}
        value={localMax}
        onChange={(event) => handleMaxChange(Number(event.target.value))}
      />
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  hasError?: boolean;
}

export default function CodeInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = false,
  hasError = false,
}: CodeInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(() => {
    const initial = Array.from({ length }, () => '');
    value.split('').forEach((char, index) => {
      if (index < length) initial[index] = char;
    });
    return initial;
  });

  useEffect(() => {
    if (!value) {
      setDigits(Array.from({ length }, () => ''));
    }
  }, [value, length]);

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus();
  }, [autoFocus]);

  const commit = (next: string[]) => {
    setDigits(next);
    onChange(next.join(''));
  };

  const handleChange = (index: number, raw: string) => {
    if (disabled) return;
    const cleaned = raw.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      commit(next);
      return;
    }
    const next = [...digits];
    let cursor = index;
    cleaned.split('').forEach((char) => {
      if (cursor < length) {
        next[cursor] = char;
        cursor += 1;
      }
    });
    commit(next);
    inputsRef.current[Math.min(cursor, length - 1)]?.focus();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      commit(next);
      inputsRef.current[index - 1]?.focus();
      event.preventDefault();
    }
    if (event.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  return (
    <div className="flex w-full items-center justify-between gap-2" role="group" aria-label="Código de verificación">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={length}
          disabled={disabled}
          aria-label={`Dígito ${index + 1}`}
          className={`h-14 w-full min-w-0 rounded-xl border bg-background-50 text-center font-heading text-xl font-bold text-foreground-950 transition-colors focus:outline-none focus:ring-2 disabled:opacity-60 ${
            hasError
              ? 'border-primary-500 focus:border-primary-500 focus:ring-primary-500/25'
              : 'border-background-300 focus:border-foreground-900 focus:ring-foreground-900/15'
          }`}
        />
      ))}
    </div>
  );
}
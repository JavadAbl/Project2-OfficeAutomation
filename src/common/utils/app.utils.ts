export function generateLetterNumber(pattern: string = 'LLNNLL'): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = '';

  for (const char of pattern) {
    if (char === 'L') {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    } else if (char === 'N') {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    } else {
      result += char;
    }
  }

  return result;
}

// Usage examples:
// generateLetterNumber('LLNN') → "AB12"
// generateLetterNumber('AAA-NNN') → "XYZ-123"

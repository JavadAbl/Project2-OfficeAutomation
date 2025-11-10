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

export function getFileExtension(filename: string) {
  if (typeof filename !== 'string') return '';
  // Strip query/hash parts (e.g., "file.tar.gz?x=1#y")
  const base = filename.split(/[?#]/)[0];

  // Get last path segment if a path is provided
  const name = base.split('/').pop();

  // Find the last dot that isn’t the first character (to avoid ".gitignore")
  const lastDot = name!.lastIndexOf('.');

  // No dot or dot is the first char => no extension
  if (lastDot <= 0) return '';

  return name!.slice(lastDot + 1);
}

export function getFileNameAndExt(input: string) {
  if (typeof input !== 'string') return ['', ''];

  // Remove query/hash and normalize slashes
  const base = input.split(/[?#]/)[0].replace(/\\/g, '/');

  // Take last path segment
  const name = base.split('/').pop() || '';

  // Find last dot that isn't the first character
  const i = name.lastIndexOf('.');
  if (i <= 0) return [name, '']; // no extension or hidden file like ".env"

  return [name.slice(0, i), name.slice(i + 1)];
}

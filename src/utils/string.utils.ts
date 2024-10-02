export function capitalizeFirstLetter(word: string): string {
  const [firstLetter, ...rest] = word;

  return firstLetter?.toLocaleUpperCase().concat(...rest) ?? '';
}

export function capitalize(string: string) {
  const words = string.trim().split(' ');

  if (words.length === 1) return capitalizeFirstLetter(words[0] as string);

  const mappedText = words.map((word) => capitalizeFirstLetter(word));

  return mappedText.join(' ');
}

export function limitChars(str: string, limit = 100) {
  if (str.length < limit) return str;

  return str.substring(0, limit).concat('...');
}

export function phoneMask(value: string) {
  // Remove any non-numeric characters
  const numbers = value.replace(/\D/g, '');

  // Format the phone number with parentheses, spaces, and a hyphen
  const formatted = numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

  // If the formatted value is shorter than the original and the original has content, return undefined (no mask applied)
  if (formatted.length < value.length && value.length) return undefined;

  // Otherwise, return the formatted value
  return formatted;
}

const normalizeIdentifier = (raw) => {
  const value = String(raw || '').trim();
  if (!value) return null;

  if (value.includes('@')) {
    return { type: 'email', value: value.toLowerCase() };
  }

  let digits = value.replace(/[\s\-()]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);

  // Indian mobile numbers: 10 digits, starting with 6, 7, 8 or 9
  if (/^[6-9]\d{9}$/.test(digits)) {
    return { type: 'phone', value: digits };
  }

  return null;
};

module.exports = { normalizeIdentifier };
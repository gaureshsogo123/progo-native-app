export function validatePriceFormat(priceString) {
  const pattern = /^(0|[1-9]\d*)(\.\d{1,2})?\.?$/;
  return pattern.test(priceString) || !priceString;
}

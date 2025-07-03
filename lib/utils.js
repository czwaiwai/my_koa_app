
function formatPrice(price, precision = 8) {
  return Number(price.toFixed(precision));
}
function formatQuantity(quantity, minUnit = 0.00000001) {
  return Math.floor(quantity / minUnit) * minUnit;
}
module.exports = {
  formatPrice,
  formatQuantity
}
/**
 * Various math utility functions
 * @type {{randBetween(number, number): number}}
 */
module.exports = {
  /**
   * Generates a random number [min;max[
   * @param {number} min The inclusive minimum
   * @param {number} max The exclusive maximum
   * @returns {number} The generated number
   */
  randBetween (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

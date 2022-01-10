/**
 * Creates a new record
 * @param {Object} obj The object from which to create the record
 * @constructor
 */
function Record (obj) {
  Object.keys(obj).forEach(key => { this[key] = obj[key] })
}

/**
 * Makes a new record
 * @param {Object} obj The object from which to create the record
 * @return {Record} The created record
 */
function make (obj) {
  const record = new Record(obj)
  Object.freeze(record)
  return record
}

/**
 * Mutates a field in this record
 * @param {string} field The name of the field
 * @param {function} mutator The mutator function for the field
 * @return {Record} A new record, with the mutated field
 */
Record.prototype.mutateField = function (field, mutator) {
  const clone = { ...this }
  clone[field] = mutator(clone[field])
  return make(clone)
}

/**
 * Mutates a record
 * @param {function} mutate The mutation function
 * @return {Record} A modified copy of the record
 */
Record.prototype.mutate = function (mutate) {
  const clone = { ...this }
  mutate(clone)
  return make(clone)
}

module.exports = { make }

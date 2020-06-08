/**
 * Replace the bad caracteres on a string.
 * @param {string} str
 */
function filterRegex (str) {
  return str.replace(/[`¤~@#%^&$*()|.<>/{}[\]\\/]/g, '').trim()
}

// ----  EXPORT  ---- //

/**
 * Returns a string with the first letter of each word in uppercase.
 * @example lorem ipsum dolor sit amet => Lorem Ipsum Dolor Sit Amet
 * @param {string} str
 * @returns {string}
 */
function filterCapitalizeAll (str) {
  let filter = ''

  if (typeof str === 'string' && str !== '') {
    filter = str.toLowerCase().replace(/\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1)).trim()
  }

  return filter
}

/**
 * Returns a string with the only first letter in uppercase.
 * @example lorem ipsum dolor sit amet => Lorem ipsum dolor sit amet
 * @param {string} str
 * @returns {string}
 */
function filterCapitalizeFirst (str) {
  let filter = ''

  if (typeof str === 'string' && str !== '') {
    filter = str.trim()
    filter = filter.charAt(0).toUpperCase() + filter.slice(1)
  }

  return filter
}

/**
 * Check an email address.
 * @param {string} email
 * @returns {boolean} checked email.
 */
function filterEmail (email) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
}

/**
 * Returns the name of the package transformed to the _npm_ standards.
 * @param {string} name
 * @returns {string}
 */
function filterName (name) {
  let filter = ''

  if (typeof name === 'string') {
    filter = filterRegex(name)
      .substr(0, 214)
      .toLowerCase()
      .replace(/[?!€£':",+-=]/g, '')
      // Replace accented characters with their "unaccented" equivalents.
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ /g, '_')
  }

  return filter
}

/**
 * Returns an available port.
 * @param {number} port should be an available port.
 * @returns {number}
 */
function filterPort (port) {
  // Port attendu entre 1000 et 9999, sinon retour par défaut : 6660
  return (!isNaN(parseInt(port)) && port > 999 && port < 10000) ? port : 6660
}

/**
 * Returns an available version number.
 * @param {string} version Should be correspond to a version number.
 * @returns {string}
 */
function filterVersion (version) {
  let filter = ''

  if (typeof version === 'string') {
    // Commas and semicolons are replaced by periods.
    filter = version.trim().replace(/[,]/g, '.')

    // Test of this version (X.XX.XXX-SNAPSHOT, for exemple) or returns by default: 0.1.0
    filter = (filter.match(/^\d+.\d+.\d+-?\w*?$/)) ? filter : '0.1.0'
  }

  return filter
}

module.exports = {
  filterCapitalizeAll,
  filterCapitalizeFirst,
  filterEmail,
  filterName,
  filterPort,
  filterVersion
}

/** *
 * All utility Functions
 */


export function notNull(d) {
  return d && d !== 'null' && d !== ' ';
}

export function getAddress(d) {
  if (!d || (notNull(d.address) && notNull(d.unit) && notNull(d.city) && notNull(d.state) && notNull(d.zipcode) && notNull(d.country))) return 'No Address Provided';
  return `${notNull(d.address) ? d.address + ', ' : ''}${notNull(d.unit) ? d.unit + ', ' : ''}${notNull(d.city) ? d.city + ', ' : ''}${notNull(d.state) ? d.state + ', ' : ''}${notNull(d.zipcode) ? d.zipcode + ', ' : ''}${notNull(d.country) ? d.country : ''}`;
}

export function convertBoolean(b) {
  return `${b === true || b === 'true' ? 'Yes' : 'No'}`;
}

export function goHere(link) {
  window.location = link;
}

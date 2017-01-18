import validator from 'validator'
import { getPlatformId } from './util'

export default {

  isValidPlatform: (input) => getPlatformId(input) !== -1,

  /* length 17, numeric */
  isValidSteamId: (input) => validator.isNumeric(input) && input.length === 17,

  /* length [3,5], alphanumeric with spaces */
  isValidXboxId: (input) =>
    validator.isAlphanumeric(input.trim()) && input.length >= 3 && input.length <= 15,

  /* length [3,16], alphanumeric with [-,_], first char must be alpha */
  isValidPSNId: (input) =>
    validator.isAlpha(input[0])
    && input.length >= 3 && input.length <= 16
    && validator.isAlphaNumeric(validator.blacklist(input, '_-')),

}

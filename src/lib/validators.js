import { getPlatformId } from './util';
import validator from 'validator';

export default {

  isValidPlatform: (input) => {
    return getPlatformId(input) !== -1;
  },
  // length 17, numeric
  isValidSteamId: (input) => {
    return validator.isNumeric(input) && input.length === 17;
  },

  // length [3,5], alphanumeric with spaces
  isValidXboxId: (input) => {
    return validator.isAlphanumeric(input.trim()) && input.length >= 3 && input.length <= 15;
  },

  // length [3,16], alphanumeric with [-,_], first char must be alpha
  isValidPSNId: (input) => {
    return validator.isAlpha(input[0]) && input.length >= 3 && input.length <= 16 && validator.isAlphaNumeric(validator.blacklist(input, '_-'));
  },

};

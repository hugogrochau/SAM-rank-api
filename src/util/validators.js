import validator from 'validator'
import Player from '../models/player'

const isValidIdForPlatform = (input, platform) => {
  const platformId = Player.getPlatformIdFromString(platform)
  return platformId !== -1 && (
    (platformId === 0 && isValidSteamId(input)) ||
    (platformId === 1 && isValidPSNId(input)) ||
    (platformId === 2 && isValidXboxId(input))
  )
}

const isValidPlatform = (input) => Player.getPlatformIdFromString(input) !== -1

const isValidSteamId = (input) => validator.isNumeric(input) && input.length === 17

const isValidPSNId = (input) =>
  validator.isAlpha(input[0])
  && input.length >= 3 && input.length <= 16
  && validator.isAlphanumeric(validator.blacklist(input, '_-'))

const isValidXboxId = (input) =>
  validator.isAlphanumeric(input.trim()) && input.length >= 3 && input.length <= 15

const isValidName = (input) => validator.isLength(input, { min: 2, max: 32 })

export default { isValidIdForPlatform, isValidPlatform, isValidSteamId, isValidXboxId, isValidPSNId, isValidName }

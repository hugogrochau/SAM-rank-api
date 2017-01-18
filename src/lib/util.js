const getPlatformId = (platformString) => {
  switch (platformString.toLowerCase()) {
    case '0':
    case 'steam': return 0
    case '1':
    case 'ps4': return 1
    case '2':
    case 'xbox': return 2
    default: return -1
  }
}

const validateIdWithPlatform = (req, platform, column = 'id') => {
  switch (getPlatformId(platform)) {
    /* steam */
    case 0:
      return req.assert(column, 'Invalid Steam 64 ID').isValidSteamId()
    /* psn */
    case 1:
      return req.assert(column, 'Invalid PSN ID').isValidPSNId()
    /* xbox */
    case 2:
      return req.assert(column, 'Invalid Xbox gamertag').isValidXboxId()
    default:
  }
}

export { getPlatformId, validateIdWithPlatform }

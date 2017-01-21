import rlt from './sources/rocket-league-tracker'

export const TRACKER = {
  ROCKET_LEAGUE_TRACKER: 1,
}

const getPlayerInformation = (platform, id, apiKey, tracker) => {
  if (!apiKey) {
    return Promise.reject(new Error('No api key'))
  }
  switch (tracker) {
    default:
    case TRACKER.ROCKET_LEAGUE_TRACKER:
      return rlt.getPlayerInformation(platform, id, apiKey)
  }
}

export default { getPlayerInformation }

import rltn from './sources/rocket-league-tracker-network'
import rltrackerPro from './sources/rltracker-pro'

export const TRACKER = {
  ROCKETLEAGUE_TRACKER_NETWORK: 1,
  RLTRACKER_PRO: 2,
}

const getPlayerInformation = (platform, id, apiKey, tracker) => {
  if (!apiKey) {
    return Promise.reject(new Error('No api key'))
  }
  switch (tracker) {
    default:
    case TRACKER.ROCKETLEAGUE_TRACKER_NETWORK:
      return rltn.getPlayerInformation(platform, id, apiKey)
    case TRACKER.RLTRACKER_PRO:
      return rltrackerPro.getPlayerInformation(platform, id, apiKey)
  }
}

export default { getPlayerInformation }

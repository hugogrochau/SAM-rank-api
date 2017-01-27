import fetch from 'isomorphic-fetch'
import querystring from 'querystring'
import toPairs from 'lodash/toPairs'

const API_URL = 'http://rltracker.pro/api/profile/get'

const playlistMap = {
  10: '1v1',
  11: '2v2',
  12: '3v3s',
  13: '3v3',
}

/* extract ranks from api stats object */
const formatRanks = (ranks) => {
  const formattedRanks = {}
  toPairs(ranks).forEach((rank) => {
    const playlist = playlistMap[rank[0]]
    const values = rank[1]
    formattedRanks[playlist] = values.rating
    formattedRanks[`${playlist}_games_played`] = values.matches_played
    formattedRanks[`${playlist}_division`] = values.division
    formattedRanks[`${playlist}_tier`] = values.tier_id
  })
  return formattedRanks
}

const getPlayerInformation = (platform, id, apiKey) => {
  const rltPlatform = platform + 1
  const query = querystring.stringify({
    api_key: apiKey,
    platform: rltPlatform,
    id,
  })
  return fetch(`${API_URL}?${query}`)
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      }
      throw new Error(`Error status from external api: ${res.status}`)
    })
    .then((jsonData) => {
      const info = formatRanks(jsonData.ranking)
      info.name = jsonData.player.nickname
      info.id = jsonData.player.player_id
      return info
    })
}

export default { getPlayerInformation }

export default (req, res, next) => {
  if (!req.user) {
    return res.jsend.error('Unauthorized')
  }
  if (!req.user.team) {
    return res.jsend.error('TeamNotFound')
  }
  if (req.user.id !== req.user.team.leader_id) {
    return res.jsend.error('Unauthorized')
  }
  next()
}

import mung from 'express-mung'

const errorCodeMap = {
  InputError: 400,
  Unauthorized: 401,
  PlayerNotFound: 404,
  TeamNotFound: 404,
  DuplicatePlayer: 409,
  DatabaseError: 500,
}

const middleware = (body, req, res) => {
  if (body.status === 'error') {
    const errorCode = errorCodeMap[body.message] || 500
    res.status(errorCode)
  }
  return body
}

export default mung.json(middleware)

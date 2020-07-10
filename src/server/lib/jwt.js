import jwt from 'jsonwebtoken'

const EXPIRATION = (((60 * 60) * 24) * 30) // 30 days

export const signJwt = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRATION })
}

export const verifyJwt = token => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

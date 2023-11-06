const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const googleVerify = async (idToken = '') => {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  })
  const {
    name: nombre,
    email: correo,
    picture: img
  } = ticket.getPayload()
  //   const userid = payload["sub"];

  return { nombre, img, correo }
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}

module.exports = {
  googleVerify
}

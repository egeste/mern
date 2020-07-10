import Mailgun from 'mailgun-js'
import config from '../config'

const mailgun = new Mailgun({
  apiKey: config.mailgun.apiKey,
  domain: config.mailgun.domain
})

export const testEmail = () => {
  const data = {
    from: 'App Team <me@samples.mailgun.org>',
    to: 'mailgun+test@egeste.net',
    subject: 'Mailgun Test',
    text: 'Mailgun Test'
  }

  return mailgun
    .messages()
    .send(data)
    .then(body => console.log(body))
}

export const sendPasswordReset = (to, passcode) => {
  return mailgun.messages().send({
    from: 'App Team <noreply@kikiapp.co>',
    to: to,
    subject: 'App Reset Password',
    text: `
You are receiving this because you (or someone else) have requested the reset of the password for your account.

Please use the following passcode: ${passcode}

If you did not request this, please ignore this email and your password will remain unchanged.
    `,
    html: `
<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
<p>Please use the following passcode: <b>${passcode}</b></p>
<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `
  }).then(result => {
    console.info(result)
  }).catch(error => {
    console.error(error)
  })
}

// (async () => {
//   try {
//     const mailService = new MailService()
//     const result = await mailService.passwordResetEmail(
//       'minhuyendo@gmail.com',
//       '888888'
//     )
//     console.error('==============result==========%j', result)
//   } catch (error) {
//     console.error('==============error==========%j', error)
//   }
// })()

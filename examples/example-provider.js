const fastify = require('fastify')()

fastify.register(require('../index'), {
  provider: 'sendgrid',
  pool: true,
  host: 'localhost',
  port: 1025,
  // secure: true,
  auth: {
    user: '',
    pass: ''
  }
})

fastify.get('/sendmail/:email', async (req, reply) => {
  const { email } = req.params

  await fastify.mailer.sendgrid.sendMail({
    from: 'sender@example.com',
    to: email,
    subject: 'foo sendgrid',
    text: 'bar sendgrid'
  })
  return reply.status(204).send()
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})

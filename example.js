const fastify = require('fastify')()

fastify.register(require('./'), {
  provider: 'sendgrid',
  pool: true,
  host: 'smtp.example.com',
  port: 465,
  secure: true,
  auth: {
    user: 'user',
    pass: 'pass'
  }
})

fastify.get('/sendmail/:email', async (req, reply) => {
  const { email } = req.params

  await fastify.mailer.sendgrid.sendMail({
    from: 'sender@example.com',
    to: email,
    subject: 'foo',
    text: 'bar'
  })
  return reply.status(204).send()
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})

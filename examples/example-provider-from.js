const fastify = require('fastify')()

fastify.register(require('../index'), {
  provider: 'aws',
  from: 'no-reply@email.com',
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

  await fastify.mailer.aws.sendMail({
    from: fastify.mailer.aws.from,
    to: email,
    subject: 'foo aws',
    text: 'bar aws'
  })
  return reply.status(204).send()
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})

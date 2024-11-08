const fastify = require('fastify')()

fastify.register(require('../index'), {
  pool: true,
  host: 'localhost',
  from: 'noreply@email.com',
  port: 1025,
  auth: {
    user: '',
    pass: ''
  }
})

fastify.get('/sendmail/:email', async (req, reply) => {
  const { email } = req.params

  await fastify.mailer.sendMail({
    from: fastify.mailer.from,
    to: email,
    subject: 'foo',
    text: 'bar'
  })
  return reply.status(204).send()
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})

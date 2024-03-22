const fp = require('fastify-plugin')
const nodemailer = require('nodemailer')

async function fastifyMailerProvider (fastify, options) {
  const { provider } = options

  if (provider && typeof provider !== 'string') {
    throw new Error('provider should be a string')
  }

  const transporter = nodemailer.createTransport(options)

  fastify.addHook('onClose', async () => {
    await transporter.close()
  })

  if (provider) {
    if (!fastify.mailer) {
      fastify.decorate('mailer', {})
    }

    if (fastify.mailer[provider]) {
      throw new Error(`provider has already been registered with name '${provider}'`)
    }

    fastify.mailer[provider] = Object.assign(transporter, { provider })
  } else {
    fastify.decorate('mailer', transporter)
  }
}

module.exports = fp(fastifyMailerProvider, {
  fastify: '4.x',
  name: 'fastify-mailer-provider'
})

module.exports.default = fastifyMailerProvider
module.exports.fastifyMailerProvider = fastifyMailerProvider

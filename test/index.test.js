'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const fastifyMailer = require('..')

const options = {
  pool: true,
  host: 'sample.com.br',
  port: 8080,
  secure: false
}

test('fastify-mailer-provider is correctly defined', async t => {
  const fastify = Fastify()

  await fastify.register(fastifyMailer, options)

  await fastify.ready()
  t.ok(fastify.mailer)
  await fastify.close()
})

test('fastify-mailer-provider is correctly defined with from', async t => {
  const fastify = Fastify()

  await fastify.register(fastifyMailer, { ...options, from: 'noreply@sample.com' })

  await fastify.ready()
  t.ok(fastify.mailer)
  t.ok(fastify.mailer.from)
  await fastify.close()
})

test('fastify-mailer-provider is correctly defined with provider', async t => {
  const fastify = Fastify()

  await fastify.register(fastifyMailer, {
    ...options,
    provider: 'google'
  })

  await fastify.ready()
  t.ok(fastify.mailer.google)
  t.ok(fastify.mailer.google.provider)
  t.equal(undefined, fastify.mailer.google.from)
  await fastify.close()
})

test('fastify-mailer-provider is correctly defined with provider and from', async t => {
  const fastify = Fastify()

  await fastify.register(fastifyMailer, {
    ...options,
    provider: 'google',
    from: 'noreply@google.com'
  })

  await fastify.ready()
  t.ok(fastify.mailer.google)
  t.ok(fastify.mailer.google.provider)
  t.ok(fastify.mailer.google.from)
  await fastify.close()
})

test('fastify-mailer-provider is correctly defined with multiple providers', async t => {
  const fastify = Fastify()

  await fastify.register(fastifyMailer, {
    ...options,
    provider: 'google'
  })

  await fastify.register(fastifyMailer, {
    ...options,
    provider: 'aws'
  })

  await fastify.ready()
  t.ok(fastify.mailer.google)
  t.ok(fastify.mailer.google.provider)
  t.ok(fastify.mailer.google.sendMail)

  t.ok(fastify.mailer.aws)
  t.ok(fastify.mailer.aws.provider)
  t.ok(fastify.mailer.google.sendMail)

  await fastify.close()
})

test('should return error when provider is defined twice', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyMailer, {
      ...options,
      provider: 'foo'
    })
    await fastify.register(fastifyMailer, {
      ...options,
      provider: 'foo'
    })
  } catch (err) {
    t.ok(err)
    t.same(err.message, 'provider has already been registered with name \'foo\'')
  }
})

test('should return error when provider is not a string', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyMailer, { provider: 0 })
  } catch (err) {
    t.ok(err)
    t.same(err.message, 'provider should be a string')
  }
})

test('should return error when from is not a string', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyMailer, { provider: 'sample', from: 0 })
  } catch (err) {
    t.ok(err)
    t.same(err.message, 'from should be a string')
  }
})

test('should return error when provider is not a string', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyMailer, { provider: {} })
  } catch (err) {
    t.ok(err)
    t.same(err.message, 'provider should be a string')
  }
})

test('should return error when from is not a string', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyMailer, { provider: 'sample', from: {} })
  } catch (err) {
    t.ok(err)
    t.same(err.message, 'from should be a string')
  }
})

test('should return createTransport error ', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyMailer, 'throw error')
  } catch (err) {
    t.ok(err)
    t.match(err.message, /Cannot create property 'mailer'/)
  }
})

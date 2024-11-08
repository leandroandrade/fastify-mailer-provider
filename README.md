# fastify-mailer-provider

This module provides a way to send email using `nodemailer`.

## Install
```
npm i fastify-mailer-provider
```

## Usage
Add it to you project with `register` and you are done!

```js
const fastify = require('fastify')()

fastify.register(require('fastify-mailer-provider'), {
    pool: true,
    host: 'smtp.example.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: 'username',
        pass: 'password'
    }
})


fastify.get('/sendmail/:email', async (req, reply) => {
    const {email} = req.params

    await fastify.mailer.sendMail({
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
```

You can also set an email provider for identification:
```js
const fastify = require('fastify')()

fastify.register(require('fastify-mailer-provider'), {
    provider: 'aws', // using aws to send email
    pool: true,
    host: 'smtp.example.com',
    port: 465,
    secure: true,
    auth: {
        user: 'username',
        pass: 'password'
    }
})


fastify.get('/sendmail/:email', async (req, reply) => {
    const {email} = req.params

    await fastify.mailer.aws.sendMail({
        from: 'sender@example.com',
        to: email,
        subject: 'foo',
        text: 'bar'
    })
    return reply.send({
        provider: fastify.mailer.aws.provider // { provider: 'aws' }
    })
})

fastify.listen({ port: 3000 }, err => {
    if (err) throw err
})
```

You can also set a _from_ with an email provider:
```js
const fastify = require('fastify')()

fastify.register(require('fastify-mailer-provider'), {
    provider: 'aws', // using aws to send email
    from: 'noreply@email.com',
    pool: true,
    host: 'smtp.example.com',
    port: 465,
    secure: true,
    auth: {
        user: 'username',
        pass: 'password'
    }
})


fastify.get('/sendmail/:email', async (req, reply) => {
    const {email} = req.params

    await fastify.mailer.aws.sendMail({
        from: fastify.mailer.aws.from,
        to: email,
        subject: 'foo',
        text: 'bar'
    })
    return reply.send({
        provider: fastify.mailer.aws.provider // { provider: 'aws' }
    })
})

fastify.listen({ port: 3000 }, err => {
    if (err) throw err
})
```

You can also set a _from_ with a default provider:
```js
const fastify = require('fastify')()

fastify.register(require('fastify-mailer-provider'), {
    from: 'noreply@email.com',
    pool: true,
    host: 'smtp.example.com',
    port: 465,
    secure: true,
    auth: {
        user: 'username',
        pass: 'password'
    }
})


fastify.get('/sendmail/:email', async (req, reply) => {
    const {email} = req.params

    await fastify.mailer.aws.sendMail({
        from: fastify.mailer.from,
        to: email,
        subject: 'foo',
        text: 'bar'
    })
    return reply.send({
        provider: fastify.mailer.aws.provider // { provider: 'aws' }
    })
})

fastify.listen({ port: 3000 }, err => {
    if (err) throw err
})
```

You can also set multiply an email providers:
```js
const fastify = require('fastify')()

fastify.register(require('fastify-mailer-provider'), {
    provider: 'aws',
    // ...
})

fastify.register(require('fastify-mailer-provider'), {
    provider: 'google',
    // ...
})

fastify.register(require('fastify-mailer-provider'), {
    provider: 'sendgrid',
    // ...
})

fastify.get('/sendmail/:email', async (req, reply) => {
    const {email} = req.params

    await fastify.mailer.aws.sendMail({ /*...*/ })
    await fastify.mailer.google.sendMail({ /*...*/ })
    await fastify.mailer.sendgrid.sendMail({ /*...*/ })
    // ...
})

fastify.listen({ port: 3000 }, err => {
    if (err) throw err
})
```

## Documentation

More details about nodemailer documentation, see [nodemailer docs](https://nodemailer.com/about/).

## License

[MIT License](https://github.com/leandroandrade/fastify-mailer-provider/blob/main/LICENSE/)

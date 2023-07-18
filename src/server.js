require('dotenv').config()

const Hapi = require('@hapi/hapi')

const ClientError = require('./exceptions/ClientError')

// Album
const albums = require('./api/albums')
const AlbumsService = require('./services/AlbumService')
const AlbumsValidator = require('./validator/albums')

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  await server.register([
    {
      plugin: albums,
      options: {
        service: new AlbumsService(),
        validator: AlbumsValidator,
      },
    },
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.statusCode)
      }

      if (!response.isServer) {
        return h.continue
      }

      return h
        .response({
          status: 'error',
          message: 'Something went wrong with our server',
        })
        .code(500)
    }

    return h.continue
  })

  await server
    .start()
    .then(() => console.log(`Server running on ${server.info.uri}`))
}

init()

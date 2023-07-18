const autoBind = require('auto-bind')

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postAlbumHandler(request, h) {
    const { payload } = request

    this._validator.validateAlbumPayload(payload)

    const { name, year } = payload

    const albumId = await this._service.createAlbum({ name, year })

    return h
      .response({
        status: 'success',
        data: { albumId },
      })
      .code(201)
  }

  async getAlbumByIdHandler(request, h) {
    const { params } = request
    const { id } = params

    const album = await this._service.readAlbumById(id)

    return h.response({ status: 'success', data: { album } })
  }

  async putAlbumByIdHandler(request, h) {
    const { payload, params } = request

    this._validator.validateAlbumPayload(payload)
    const { id } = params
    const { name, year } = payload

    await this._service.updateAlbumById(id, { name, year })

    return h.response({
      status: 'success',
      message: 'Album updated',
    })
  }

  async deleteAlbumByIdHandler(request, h) {
    const { params } = request
    const { id } = params

    await this._service.deleteAlbumById(id)

    return h.response({ status: 'success', message: 'Album deleted' })
  }
}

module.exports = AlbumsHandler

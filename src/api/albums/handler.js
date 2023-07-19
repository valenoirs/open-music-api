const autoBind = require('auto-bind')

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postAlbumHandler(req, h) {
    const { payload } = req

    this._validator.validateAlbumPayload(payload)

    const albumId = await this._service.createAlbum(payload)

    return h
      .response({
        status: 'success',
        data: { albumId },
      })
      .code(201)
  }

  async getAlbumByIdHandler(req, h) {
    const { id } = req.params

    const album = await this._service.readAlbumById(id)

    return h.response({ status: 'success', data: { album } })
  }

  async putAlbumByIdHandler(req, h) {
    const { payload, params } = req

    this._validator.validateAlbumPayload(payload)

    const { id } = params

    await this._service.updateAlbumById(id, payload)

    return h.response({
      status: 'success',
      message: 'Album updated',
    })
  }

  async deleteAlbumByIdHandler(req, h) {
    const { id } = req.params

    await this._service.deleteAlbumById(id)

    return h.response({ status: 'success', message: 'Album deleted' })
  }
}

module.exports = AlbumsHandler

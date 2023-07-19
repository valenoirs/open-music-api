const autoBind = require('auto-bind')

class SongsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postSongHandler(req, h) {
    const { payload } = req

    this._validator.validateSongPayload(payload)

    const { title, year, genre, performer, duration, albumId } = payload

    const songId = await this._service.createSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    })

    return h
      .response({
        status: 'success',
        data: { songId },
      })
      .code(201)
  }

  async getSongsHandler(req, h) {
    const songs = await this._service.readSongs()

    return h.response({ status: 'success', data: { songs } })
  }

  async getSongByIdHandler(req, h) {
    const { id } = req.params

    const song = await this._service.readSongById(id)

    return h.response({ status: 'success', data: { song } })
  }

  async putSongByIdHandler(req, h) {
    const { params, payload } = req

    this._validator.validateSongPayload(payload)

    const { id } = params
    const { title, year, genre, performer, duration, albumId } = payload

    await this._service.updateSongById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    })

    return h.response({ status: 'success', message: 'Song updated' })
  }

  async deleteSongByIdHandler(req, h) {
    const { id } = req.params

    await this._service.deleteSongById(id)

    return h.response({ status: 'success', message: 'Song deleted' })
  }
}

module.exports = SongsHandler

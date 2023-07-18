exports.albumDBToModel = ({ album_id, name, year }) => {
  return { id: album_id, name, year }
}

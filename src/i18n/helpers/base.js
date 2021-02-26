export default {
  // TODO: 完善
  create ({
    name = 'name',
    id = 'id'
  } = {}) {
    return {
      __lang__: {
        name,
        id,
        /**
         * id 小写
         * @type {string}
         */
        idLowerCase: id.toLowerCase()
      }
    }
  }
}
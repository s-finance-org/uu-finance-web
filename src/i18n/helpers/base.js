export default {
  create ({
    name = '__lang__.name',
    id = '__lang__.id'
  } = {}) {
    return {
      __lang__: {
        name,
        id,
      }
    }
  }
}
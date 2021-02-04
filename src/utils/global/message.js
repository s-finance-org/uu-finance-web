import { message } from 'ant-design-vue'

export default {
  success (msg) {
    message.success(msg)
  },
  error (msg) {
    message.error(msg)
  },
  info (msg) {
    message.info(msg)
  },
  warn (msg) {
    message.warn(msg)
  },
  loading (msg) {
    message.loading(msg)
  }
}

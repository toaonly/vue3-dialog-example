import mitt from 'mitt'

const eventBus = mitt()

const emitter = {
  _listeners: {} as {
    [x: string]: ((data?: any) => void)[]
  },

  emit(event: string, data?: any) {
    eventBus.emit(event, data)
  },

  on(event: string, callback: (data?: any) => void) {
    const listenersByEvent = this._listeners[event] || []

    eventBus.on(event, callback)
    this._listeners[event] = listenersByEvent.concat(callback)
  },

  once(event: string, callback: (data?: any) => void) {
    const _onceCallback = (data?: any) => {
      callback(data)

      this.off(event, _onceCallback)
      delete this._listeners[event]
    }

    this.on(event, _onceCallback)
  },

  off(event: string, callback: (data?: any) => void) {
    const listenersByEvent = this._listeners[event] || []

    eventBus.off(event, callback)
    this._listeners[event] = listenersByEvent.filter((cb) => cb !== callback)
  },

  listeners(event: string) {
    return this._listeners[event] || []
  },
}

export default class CustomEvent<T extends string, K = T> {
  static Emitter = emitter

  trigger: T
  defaultPrevented = false
  type: K

  constructor(type: K, trigger?: T) {
    this.type = type
    this.trigger = trigger!
  }

  get preventDefault() {
    return () => {
      this.defaultPrevented = true
    }
  }
}

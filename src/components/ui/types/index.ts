type _E = HTMLElement

type _Vu<E extends Event, T extends _E> = Omit<E, 'target'> & {
  target: T
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Vu {
  export type FocusEventHandler<T extends _E> = _Vu<FocusEvent, T>
  export type InputEventHandler<T extends _E> = _Vu<InputEvent, T>
  export type KeyboardEventHandler<T extends _E> = _Vu<KeyboardEvent, T>
  export type MouseEventHandler<T extends _E> = _Vu<MouseEvent, T>
  export type SubmitEventHandler<T extends _E> = _Vu<SubmitEvent, T>

  export type UISize = 'sm' | 'md' | 'lg'
}

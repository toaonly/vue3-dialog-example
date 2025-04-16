import { COLORS } from '../utils'

enum ONLY_BUTTON_COLORS {
  CLEAR = 'transparent',
  INACTIVE = 'inactive',
}

export enum BUTTON_COLORS {
  PRIMARY = COLORS.PRIMARY,
  CLEAR = ONLY_BUTTON_COLORS.CLEAR,
  INACTIVE = ONLY_BUTTON_COLORS.INACTIVE,
}

export enum BUTTON_SIZE {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}

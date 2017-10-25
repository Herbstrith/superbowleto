import { always, cond, equals, T } from 'ramda'
import Bradesco from './bradesco'
import Development from './development'
import { NotFoundError } from '../lib/errors/index'

export const findProvider = cond([
  [equals('bradesco'), always(Bradesco)],
  [equals('development'), always(Development)],
  [T, () => {
    throw new NotFoundError({
      message: 'Provider not found'
    })
  }]
])


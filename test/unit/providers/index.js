import test from 'ava'
import { findProvider } from '../../../build/providers'
import BradescoProvider from '../../../build/providers/bradesco'
import DevelopmentProvider from '../../../build/providers/development'
import { NotFoundError } from '../../../build/lib/errors/index'

test.only('findProvider: with bradesco provider', (t) => {
  const bradesco = findProvider('bradesco')

  t.deepEqual(BradescoProvider, bradesco, 'should return the bradesco provider')
})

test('findProvider: with development provider', (t) => {
  const development = findProvider('development')

  t.deepEqual(DevelopmentProvider, development, 'should return the development provider')
})

test('findProvider: with no existing provider', (t) => {
  const tryToGetProvider = () => findProvider('santander')

  t.throws(
    tryToGetProvider,
    NotFoundError,
    'Provider not found',
    'should throw an error'
  )
})

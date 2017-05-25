import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { mock } from './helpers'
import * as boletoHandler from '../../../src/resources/boleto'

const create = normalizeHandler(boletoHandler.create)

test('creates a boleto', async (t) => {
  const payload = mock

  const { body, statusCode } = await create({
    body: payload
  })

  t.is(statusCode, 201)
  t.is(body.object, 'boleto')
  t.true(body.title_id != null)
  t.true(typeof body.title_id === 'number')
  assert.containSubset(body, {
    status: 'issued',
    paid_amount: 0,
    amount: payload.amount,
    instructions: payload.instructions,
    issuer: payload.issuer,
    issuer_id: null,
    payer_name: payload.payer_name,
    payer_document_type: payload.payer_document_type,
    payer_document_number: payload.payer_document_number,
    queue_url: payload.queue_url
  })
})

test('creates a boleto with invalid data', async (t) => {
  const payload = {
    expiration_date: true,
    issuer: 100,
    payer_document_type: 'xxx'
  }

  const { body, statusCode } = await create({
    body: payload
  })

  t.is(statusCode, 400)
  assert.containSubset(body, {
    errors: [{
      type: 'invalid_parameter',
      message: '"queue_url" is required',
      field: 'queue_url'
    }, {
      type: 'invalid_parameter',
      message: '"expiration_date" must be a number of milliseconds or valid date string',
      field: 'expiration_date'
    }, {
      type: 'invalid_parameter',
      message: '"amount" is required',
      field: 'amount'
    }, {
      type: 'invalid_parameter',
      message: '"issuer" must be a string',
      field: 'issuer'
    }, {
      type: 'invalid_parameter',
      message: '"payer_name" is required',
      field: 'payer_name'
    }, {
      type: 'invalid_parameter',
      message: '"payer_document_type" must be one of [cpf, cnpj]',
      field: 'payer_document_type'
    }, {
      type: 'invalid_parameter',
      message: '"payer_document_number" is required',
      field: 'payer_document_number'
    }]
  })
})

test('creates a non-registrable boleto', async (t) => {
  const payload = {
    expiration_date: new Date(),
    amount: 2000,
    issuer: 'bradesco',
    instructions: 'Please do not accept after expiration_date',
    register: false,
    queue_url: 'http://yopa/queue/test'
  }

  const { body, statusCode } = await create({
    body: payload
  })

  t.is(statusCode, 201)
  t.is(body.object, 'boleto')
  t.true(body.title_id != null)
  t.true(typeof body.title_id === 'number')
  assert.containSubset(body, {
    status: 'issued',
    paid_amount: 0,
    amount: payload.amount,
    instructions: payload.instructions,
    issuer: payload.issuer,
    issuer_id: null,
    payer_name: null,
    payer_document_type: null,
    payer_document_number: null,
    queue_url: payload.queue_url
  })
})

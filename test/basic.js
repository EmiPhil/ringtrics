const tap = require('tap')
const R = require('../src/Ringtrics')

tap.pass('Test suite loaded')

tap.equal(Int32Array.prototype.isPrototypeOf(R(1)), true)

let arrayTypes = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  BigInt64Array,
  BigUint64Array,
  Float32Array,
  Float64Array
]

arrayTypes.forEach((type) => {
  tap.equal(type.prototype.isPrototypeOf(R(1, type)), true)
})

tap.equal(R(5).length, 5)

tap.test('injest works', t => {
  let a = R(1)
  t.equal(a[0], 0)

  a.injest(1)
  t.equal(a[0], 0)
  
  a = a.injest(1)
  t.equal(a[0], 1)

  t.end()
})

tap.test('injest updates metrics', t => {
  let a = R(3).injest(1).injest(2).injest(3)

  t.equal(a.metrics.min, 1)
  t.equal(a.metrics.max, 3)
  t.equal(a.metrics.sum, 6)
  t.equal(a.metrics.average, 2)

  a = a.injest(4).injest(5).injest(6)

  t.equal(a.metrics.min, 4)
  t.equal(a.metrics.max, 6)
  t.equal(a.metrics.sum, 15)
  t.equal(a.metrics.average, 5)

  t.end()
})

tap.test('injest works with arrays', t => {
  let a = R(3).injest([1, 2, 3])
  t.equal(a[0], 1)
  t.equal(a[1], 2)
  t.equal(a[2], 3)
  t.end()
})

tap.test('injest works with arrays longer than size', t => {
  let a = R(3).injest([0, 0, 0, 1, 2, 3])
  t.equal(a[0], 1)
  t.equal(a[1], 2)
  t.equal(a[2], 3)
  t.end()
})

tap.test('injest works with arrays of arrays', t => {
  let a = R(3).injest([[1], [2], [3]])
  t.equal(a[0], 1)
  t.equal(a[1], 2)
  t.equal(a[2], 3)
  t.end()
})

tap.test('injest throws a type error for non num / array types', t => {
  try {
    R(1).injest('string')
  } catch (err) {
    t.equal(err instanceof TypeError, true)
    t.end()
  }
})

function Ringtrics (size, ArrayObject = Int32Array) {
  class R extends ArrayObject {
    constructor(props, metrics) {
      super(props)
      this.constructor.prototype.metrics = metrics
    }

    injest_one(num) {
      let { min, max, sum, average } = this.constructor.prototype.metrics
      let array = [...this.slice(1), num]

      let ejected = this[0]

      sum = sum - ejected + num

      if (ejected === min) {
        min = array.reduce((min, num) => Math.min(min, num), array[0])
      } else {
        min = Math.min(min, num)
      }

      if (ejected === max) {
        max = array.reduce((max, num) => Math.max(max, num), array[0])
      } else {
        max = Math.max(max, num)
      }
      
      let metrics = {
        min,
        max,
        sum,
        average: sum / this.length
      }

      return new this.constructor(array, metrics)
    }

    injest(any) {
      if (typeof any === 'number') {
        return this.injest_one(any)
      }

      if (Array.isArray(any)) {
        return any.reduce((r, num) => r.injest(num), this)
      }

      throw new TypeError('Injest only supports numbers or arrays')
    }
  }

  R.prototype.metrics = {}
  
  return new R(size, { min: 0, max: 0, sum: 0, average: 0 })
}

module.exports = Ringtrics

import { getType } from './helper'

type Callback<T = any> = (key: string, value?: T, temp?: { value: T, exp: number }) => void

export class WebStorage {
  private store!: Storage

  static enabledType: Set<string> = new Set(['string', 'number', 'object', 'boolean', 'bigint'])

  callbacks: Record<string, Callback[]> = {}

  constructor(storageType: 'local' | 'session') {
    if (storageType === 'local') {
      this.store = localStorage
      return
    }
    if (storageType === 'session') {
      this.store = sessionStorage
      return
    }
  }

  /**
   * 往缓存里添加单条记录
   * @param key 单个值的键
   * @param value 单个值
   * @param exp 单个值的过期时间
   */
  set(key: string, value: any, exp = 0): WebStorage {
    if (value === null) return this

    const valueType = typeof value
    if (!WebStorage.enabledType.has(valueType)) return this

    // exp如果为0则永不过期
    const temp: {value: any, exp: number} = { value: null, exp: 0 }

    // 如果是简单的数据则直接存入
    temp.value = value
    temp.exp = exp ? Date.now() + exp * 1000 : 0

    // 如果有绑定回调则此处出发回调
    if(this.callbacks[key]) {
      this.callbacks[key].forEach(fn => fn(key, value, temp))
    }
    this.store.setItem(key, JSON.stringify(temp))
    return this
  }

  // 获取对应的字段
  get(key: string, defaultValue?: any): any
  get(keys: string[]): any[]
  get(key: any, defaultValue = null) {
    let type = getType(key)
    if (type === 'string') {
      let stringTmp = this.store.getItem(key)

      // 如果未查到此项
      if (stringTmp === null) return defaultValue
      
      let tmp = JSON.parse(stringTmp)

      // 如果未过期
      if (tmp.exp > Date.now() || tmp.exp === 0) return tmp.value

      // 数据过期
      this.remove(key)
      return defaultValue
    }

    if (type === 'array') {
      return key.map((v: string) => this.get(v))
    }

    throw Error(`get第一个参数的类型应该是string或者array, 但传入的值是${type}类型`)
  }

  /**
   * 移除一个缓存值
   * @param key 需要移除的值的键
   */
  remove(key: string): WebStorage
  /**
   * 移除多个缓存值
   * @param keys 需要移除的值的键的数组
   */
  remove(keys: string[]): WebStorage
  /**
   * 清空缓存
   */
  remove(): WebStorage
  remove(item?: any) {
    if (item === undefined) {
      this.store.clear()
    } else if (typeof item === 'string') {
      this.store.removeItem(item)
    } else if (Array.isArray(item)) {
      item.forEach(key => this.remove(key))
    }
    return this
  }

  /**
   * 添加一个值改动的回调
   * @param key 键
   * @param callback 回调函数
   */
  on(key: string, callback: Callback): void {
    if (this.callbacks[key]) {
      this.callbacks[key].push(callback)
    } else {
      this.callbacks[key] = [callback]
    }
  }

  /**
   * 移除多个回调
   * @param keys 需要移除的回调的字符串数组
   */
  off(keys: string[]): void
  /**
   * 移除单个回调
   * @param key 需要移除的记录的键
   */
  off(key: string): void
  /**
   * 移除所有回调
   */
  off(): void
  off(key?: any) {
    if (typeof key === 'string') {
      delete this.callbacks[key]
    } else if (key === undefined) {
      this.callbacks = {}
    } else if(Array.isArray(key)) {
      key.forEach((item: string) => this.off(item))
    }
  }
}

interface Cache {
  session?: WebStorage,
  local?: WebStorage,
  create(type: 'session' | 'local'): WebStorage
}

const WebCache: Cache = {
  create(type): WebStorage {
    let cache = this[type]
    if (cache !== undefined) {
      return cache
    } else {
      this[type] = new WebStorage(type)
      return this[type] as WebStorage
    }
  }
}

export default WebCache
// 手写实现一个单例模式

class Singleton {
  static ins = null

  constructor() {
    if (!Singleton.ins) {
      Singleton.ins = this
    }
    return Singleton.ins
  }

  getIns() {
    if (!Singleton.ins) {
      Singleton.ins =  new Singleton()
    }

    return Singleton.ins
  }
}
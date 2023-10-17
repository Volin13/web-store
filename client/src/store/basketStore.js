import { makeAutoObservable } from 'mobx';

export default class BasketStore {
  constructor() {
    this._basket = [];
    this._order = {};

    makeAutoObservable(this);
  }

  setBasket(devices) {
    this._devices = devices;
  }
  setOrder(devices) {
    this._devices = devices;
  }

  get basket() {
    return this._types;
  }

  get order() {
    return this._types;
  }
}

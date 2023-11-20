import { makeAutoObservable, observe } from 'mobx';

export default class BasketStore {
  constructor() {
    this._basket = [];
    this._order = {};

    makeAutoObservable(this);
    observe(this._basket, change => {
      if (change.type === 'splice' || change.type === 'update') {
        console.log('Кошик змінився:', this._basket);
      }
    });
  }

  setBasket(devices) {
    this._basket = devices;
  }
  setOrder(device) {
    this._order = device;
  }
  addToBasket(device) {
    this._basket.push(device);
  }

  removeFromBasket(deviceId) {
    this._basket = this._basket.filter(device => device.id !== deviceId);
  }

  get basket() {
    return this._basket;
  }

  get order() {
    return this._order;
  }
}

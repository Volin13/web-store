import { makeAutoObservable } from 'mobx';

export default class UserStore {
  _isAuth = false;
  _user = {};

  constructor() {
    makeAutoObservable(this);
  }

  setIsAuth(bool) {
    this._isAuth = bool;
  }

  setUser(user) {
    this._user = user;
  }

  get isAuth() {
    return this._isAuth;
  }

  get user() {
    return this._user;
  }
}

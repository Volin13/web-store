import { observable, action, makeObservable, computed } from 'mobx';

export default class UserStore {
  _isAuth = false;
  _user = {};
  _userLogin = '';
  _avatar = '';
  _id = 0;
  _role = '';
  _email = '';
  constructor() {
    makeObservable(this, {
      _isAuth: observable,
      _user: observable,
      _userLogin: observable,
      _avatar: observable,
      _id: observable,
      _role: observable,
      _email: observable,
      setIsAuth: action,
      setUser: action,
      setUserLogin: action,
      setAvatar: action,
      setId: action,
      setRole: action,
      setEmail: action,
      isAuth: computed,
      user: computed,
      userLogin: computed,
      avatar: computed,
      role: computed,
      email: computed,
      id: computed,
    });
  }
  setIsAuth(bool) {
    this._isAuth = bool;
  }

  setUser(user) {
    this._user = user;
  }
  setUserLogin(userLogin) {
    this._userLogin = userLogin;
  }
  setAvatar(avatar) {
    this._avatar = avatar;
  }
  setId(id) {
    this._id = id;
  }
  setRole(role) {
    this._role = role;
  }
  setEmail(email) {
    this._email = email;
  }

  get isAuth() {
    return this._isAuth;
  }

  get user() {
    return this._user;
  }
  get userLogin() {
    return this._userLogin;
  }
  get avatar() {
    return this._avatar;
  }
  get role() {
    return this._role;
  }
  get email() {
    return this._email;
  }
  get id() {
    return this._id;
  }
}

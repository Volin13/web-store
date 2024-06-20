import { observable, action, makeObservable, computed } from 'mobx';

export default class UserStore {
  _isAuth = false;
  _user = {};
  _userLogin = '';
  _avatar = '';
  _id = 0;
  _role = 'USER';
  _email = '';
  _refreshToken = '';
  _accessToken = '';
  _adminComments = [];
  _commentPage = 1;
  _commentDate = '';
  _commentsLimit = 8;
  _totalCommentCount = 0;

  constructor() {
    makeObservable(this, {
      _isAuth: observable,
      _refreshToken: observable,
      _accessToken: observable,
      _user: observable,
      _userLogin: observable,
      _avatar: observable,
      _id: observable,
      _role: observable,
      _email: observable,
      _adminComments: observable,
      _commentPage: observable,
      _commentDate: observable,
      _commentsLimit: observable,
      _totalCommentCount: observable,
      setIsAuth: action,
      setRefreshToken: action,
      setAccessToken: action,
      setUser: action,
      setUserLogin: action,
      setAvatar: action,
      setId: action,
      setRole: action,
      setEmail: action,
      setCommentPage: action,
      setCommentDate: action,
      setCommentsLimit: action,
      setTotalCommentCount: action,
      setAdminComments: action,
      isAuth: computed,
      accessToken: computed,
      refreshToken: computed,
      user: computed,
      userLogin: computed,
      avatar: computed,
      role: computed,
      email: computed,
      id: computed,
      adminComments: computed,
      commentsLimit: computed,
      totalCommentCount: computed,
      commentPage: computed,
      commentDate: computed,
    });
  }
  setRefreshToken(refreshToken) {
    this._refreshToken = refreshToken;
  }
  setAccessToken(accessToken) {
    this._accessToken = accessToken;
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
  setAdminComments(adminComments) {
    this._adminComments = adminComments;
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
  setCommentPage(commentPage) {
    this._commentPage = commentPage;
  }
  setCommentDate(commentDate) {
    this._commentDate = commentDate;
  }
  setCommentsLimit(totalCommentsCount) {
    this._totalCommentsCount = totalCommentsCount;
  }
  setTotalCommentCount(totalCommentCount) {
    this._totalCommentCount = totalCommentCount;
  }

  get refreshToken() {
    return this._refreshToken;
  }
  get accessToken() {
    return this._accessToken;
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
  get adminComments() {
    return this._adminComments;
  }
  get commentPage() {
    return this._commentPage;
  }
  get commentDate() {
    return this._commentDate;
  }
  get totalCommentCount() {
    return this._totalCommentCount;
  }
  get commentsLimit() {
    return this._commentsLimit;
  }
}

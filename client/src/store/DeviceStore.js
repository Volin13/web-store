import { observable, action, makeObservable, computed } from 'mobx';
export default class DeviceStore {
  _types = [];
  _brands = [];
  _devices = [];
  _devicesOrder = [];
  _query = '';
  _selectedType = {};
  _selectedBrand = {};
  _page = 1;
  _limit = 8;
  _commentPage = 1;
  _commentsLimit = 4;
  _totalCount = 0;
  _totalCommentCount = 0;

  constructor() {
    makeObservable(this, {
      _types: observable,
      _brands: observable,
      _devices: observable,
      _devicesOrder: observable,
      _query: observable,
      _selectedType: observable,
      _selectedBrand: observable,
      _page: observable,
      _limit: observable,
      _commentPage: observable,
      _commentsLimit: observable,
      _totalCount: observable,
      _totalCommentCount: observable,
      setTypes: action,
      setBrands: action,
      setDevices: action,
      setDevicesOrder: action,
      setQuery: action,
      setSelectedType: action,
      setSelectedBrand: action,
      setPage: action,
      setTotalCount: action,
      setLimit: action,
      types: computed,
      brands: computed,
      devices: computed,
      devicesOrder: computed,
      query: computed,
      selectedType: computed,
      selectedBrand: computed,
      page: computed,
      totalCount: computed,
      totalCommentCount: computed,
      limit: computed,
      commentPage: computed,
      commentsLimit: computed,
    });
  }

  setTypes(types) {
    this._types = types;
  }

  setBrands(brands) {
    this._brands = brands;
  }

  setDevices(devices) {
    this._devices = devices;
  }

  setDevicesOrder(devicesOrder) {
    this._devicesOrder = devicesOrder;
  }

  setQuery(query) {
    this._query = query;
  }

  setSelectedType(type) {
    this.setPage(1);
    this.setCommentPage(1);
    this._selectedType = type;
  }

  setSelectedBrand(brand) {
    this.setPage(1);
    this.setCommentPage(1);
    this._selectedBrand = brand;
  }

  setPage(page) {
    this._page = page;
  }
  setCommentPage(commentPage) {
    this._commentPage = commentPage;
  }

  setTotalCount(totalCount) {
    this._totalCount = totalCount;
  }
  setTotalCommentCount(totalCommentCount) {
    this._totalCommentCount = totalCommentCount;
  }

  setLimit(limit) {
    this._limit = limit;
  }
  setCommentsLimit(commentsLimit) {
    this._commentsLimit = commentsLimit;
  }

  get types() {
    return this._types;
  }

  get brands() {
    return this._brands;
  }

  get devices() {
    return this._devices;
  }

  get devicesOrder() {
    return this._devicesOrder;
  }

  get query() {
    return this._query;
  }

  get selectedType() {
    return this._selectedType;
  }

  get selectedBrand() {
    return this._selectedBrand;
  }

  get page() {
    return this._page;
  }

  get totalCount() {
    return this._totalCount;
  }
  get totalCommentCount() {
    return this._totalCommentCount;
  }

  get limit() {
    return this._limit;
  }
  get commentPage() {
    return this._commentPage;
  }
  get commentsLimit() {
    return this._commentsLimit;
  }
}

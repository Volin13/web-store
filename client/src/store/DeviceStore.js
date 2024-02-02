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
  _totalCount = 0;
  _limit = 8;

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
      _totalCount: observable,
      _limit: observable,
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
      limit: computed,
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
    this._selectedType = type;
  }

  setSelectedBrand(brand) {
    this.setPage(1);
    this._selectedBrand = brand;
  }

  setPage(page) {
    this._page = page;
  }

  setTotalCount(totalCount) {
    this._totalCount = totalCount;
  }

  setLimit(limit) {
    this._limit = limit;
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

  get limit() {
    return this._limit;
  }
}

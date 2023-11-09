import axios from 'axios';
import { toast } from 'react-toastify';
const apiKey = process.env.REACT_APP_NP_API_KEY;
const apiUrl = process.env.REACT_APP_NP_API_ENDPOINT;
const modelName = 'Address';

export async function fetchNovaPoshtaOffice(сity = '', terminal = '') {
  try {
    const response = await axios.post(apiUrl, {
      apiKey: apiKey,
      modelName: modelName,
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityName: сity,
        Limit: 15,
        Language: 'UA',
        WarehouseId: terminal,
      },
    });
    const data = response.data;
    return data.data;
  } catch (error) {
    console.error('Помилка запиту до Нової пошти:', error);
    return toast.error('Помилка запиту до Нової пошти, спробуйте пізніше');
  }
}

export async function fetchNovaPoshtaRegions() {
  try {
    const response = await axios.post(apiUrl, {
      apiKey: apiKey,
      modelName: modelName,
      calledMethod: 'getAreas',
      methodProperties: {},
    });
    const data = response.data;
    return data.data;
  } catch (error) {
    console.error('Помилка запиту до Нової пошти:', error);
    return toast.error('Помилка запиту до Нової пошти, спробуйте пізніше');
  }
}
export async function fetchNovaPoshtaCities(areaRef, str) {
  try {
    const response = await axios.post(apiUrl, {
      apiKey: apiKey,
      modelName: modelName,
      calledMethod: 'getSettlements',
      methodProperties: {
        AreaRef: areaRef,
        Warehouse: '1',
        FindByString: str,
        Page: '1',
        Limit: 50,
      },
    });
    const data = response.data;
    return data.data;
  } catch (error) {
    console.error('Помилка запиту до Нової пошти:', error);
    return toast.error('Помилка запиту до Нової пошти, спробуйте пізніше');
  }
}

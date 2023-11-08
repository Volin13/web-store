import axios from 'axios';

const apiKey = process.env.REACT_APP_NP_API_KEY;
const apiUrl = process.env.REACT_APP_NP_API_ENDPOINT;
const modelName = 'Address';
const calledMethod = 'getWarehouses';

export async function fetchNovaPoshtaData(сity = '', terminal = '') {
  try {
    const response = await axios.post(apiUrl, {
      apiKey: apiKey,
      modelName: modelName,
      calledMethod: calledMethod,
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
  }
}

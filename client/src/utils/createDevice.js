// Функція для збору і відправки даних на бекенд

const addDevice = async (values, device, info, createDevice, onHide) => {
  const formData = new FormData();
  formData.append('name', values.name);
  formData.append('price', `${values.price}`);
  formData.append('mainImg', values.mainImg);
  formData.append('rating', values.rating);
  formData.append('brandId', device.selectedBrand.id);
  formData.append('typeId', device.selectedType.id);
  formData.append('info', JSON.stringify(info));
  values.deviceImages.forEach((deviceImages, index) => {
    formData.append(`images[${index}][deviceImage]`, deviceImages.deviceImage);
    formData.append(`images[${index}][number]`, deviceImages.number);
  });
  await createDevice(formData);
  onHide();
};
export default addDevice;

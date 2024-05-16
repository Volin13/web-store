// Функція для збору і відправки даних на бекенд

const editData = async (
  values,
  device,
  deviceToEdit,
  deviceImages,
  info,
  editDevice,
  onHide
) => {
  const formData = new FormData();
  const fileNames = [];
  const oldfileNames = [];

  formData.append('name', values.name);
  formData.append('price', values.price);
  formData.append('oldMainImg', deviceToEdit?.mainImg);
  formData.append('rating', values.rating);
  formData.append('brandId', device.selectedBrand.id);
  formData.append('typeId', device.selectedType.id);
  formData.append('info', JSON.stringify(info));
  deviceImages.forEach((item, index) => {
    if (item.deviceImage instanceof File) {
      formData.append(`images[${index}][deviceImage]`, item.deviceImage);
      formData.append(`images[${index}][number]`, item.number);
    } else if (item.fileName) {
      fileNames.push(item.fileName);
    }
  });
  deviceToEdit.deviceImages.forEach(image => {
    oldfileNames.push(image.fileName);
  });
  formData.append('oldDeviceImages', JSON.stringify(oldfileNames));
  formData.append('deviceImagesNames', JSON.stringify(fileNames));
  await editDevice(deviceToEdit?.id, formData);
  onHide();
};

export default editData;

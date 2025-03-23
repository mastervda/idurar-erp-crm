import axios from 'axios';

export const listWilayah = async () => {
  try {
    const response = await axios.get('/wilayah/list');
    return response.data;
  } catch (error) {
    throw new Error('Gagal mengambil data wilayah');
  }
};

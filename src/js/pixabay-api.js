import axios from 'axios';

export async function getImagesByQuery(query, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '51711759-c98880f89c2a2cc3e02319f38',
        q: query.trim(),
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 15,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Помилка при отриманні зображень:', error);
    throw error;
  }
}
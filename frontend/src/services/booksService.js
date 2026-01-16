const API_URL = 'http://localhost:3000';

export const booksService = {
  getMetrics: async (author = '') => {
    const url = author 
      ? `${API_URL}?author=${encodeURIComponent(author)}`
      : API_URL;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Error al obtener las métricas');
    }
    
    return await response.json();
  }
};
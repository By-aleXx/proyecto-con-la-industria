import apiClient from './axiosInterceptor';

class ProductService {
  // Listar productos con filtros
  async getProductos(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.material) params.append('material', filters.material);
    if (filters.color) params.append('color', filters.color);
    if (filters.serie) params.append('serie', filters.serie);
    if (filters.buscar) params.append('buscar', filters.buscar);
    
    const response = await apiClient.get('/productos/', { params });
    return response.data;
  }

  // Obtener detalle de producto
  async getProducto(id) {
    const response = await apiClient.get(`/productos/${id}/`);
    return response.data;
  }
}

const productServiceInstance = new ProductService();
export default productServiceInstance;


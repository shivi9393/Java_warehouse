import api from './client';

export const getWarehouses = async (organizationId) => {
    const response = await api.get(`/warehouses?organizationId=${organizationId}`);
    return response.data;
};

export const getWarehouse = async (id) => {
    const response = await api.get(`/warehouses/${id}`);
    return response.data;
};

export const createWarehouse = async (data) => {
    const response = await api.post('/warehouses', data);
    return response.data;
};

export const updateWarehouse = async (id, data) => {
    const response = await api.put(`/warehouses/${id}`, data);
    return response.data;
};

export const addStorageZone = async (warehouseId, data) => {
    const response = await api.post(`/warehouses/${warehouseId}/zones`, data);
    return response.data;
};

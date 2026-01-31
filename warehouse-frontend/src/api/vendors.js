import api from './client';

export const getVendors = async (organizationId) => {
    const response = await api.get(`/vendors?organizationId=${organizationId}`);
    return response.data;
};

export const getVendor = async (id) => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
};

export const createVendor = async (data) => {
    const response = await api.post('/vendors', data);
    return response.data;
};

export const updateVendor = async (id, data) => {
    const response = await api.put(`/vendors/${id}`, data);
    return response.data;
};

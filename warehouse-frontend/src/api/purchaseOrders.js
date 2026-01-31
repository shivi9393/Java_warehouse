import api from './client';

export const getPurchaseOrders = async (organizationId) => {
    const response = await api.get(`/purchase-orders?organizationId=${organizationId}`);
    return response.data;
};

export const getPurchaseOrder = async (id) => {
    const response = await api.get(`/purchase-orders/${id}`);
    return response.data;
};

export const createPurchaseOrder = async (data) => {
    const response = await api.post('/purchase-orders', data);
    return response.data;
};

export const approvePurchaseOrder = async (id) => {
    const response = await api.put(`/purchase-orders/${id}/approve`);
    return response.data;
};

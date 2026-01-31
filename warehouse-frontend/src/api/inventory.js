import api from './client';

export const getInventory = async (warehouseId) => {
    const response = await api.get(`/inventory?warehouseId=${warehouseId}`);
    return response.data;
};

export const stockIn = async (data) => {
    const response = await api.post('/inventory/stock-in', data);
    return response.data;
};

export const stockOut = async (data) => {
    const response = await api.post('/inventory/stock-out', data);
    return response.data;
};

export const getLowStockAlerts = async (warehouseId) => {
    const params = warehouseId ? { warehouseId } : {};
    const response = await api.get('/inventory/alerts/low-stock', { params });
    return response.data;
};

export const getExpiringItems = async (daysAhead = 30) => {
    const response = await api.get(`/inventory/alerts/expiring?daysAhead=${daysAhead}`);
    return response.data;
};

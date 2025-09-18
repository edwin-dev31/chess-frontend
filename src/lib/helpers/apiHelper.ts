import { javaAPI } from '../constants/axios';
import { AxiosRequestConfig } from 'axios';

interface RequestOptions extends AxiosRequestConfig {
    token?: string;
    body?: any;
}

export async function apiHelper<T>(
    endpoint: string,
    options?: RequestOptions
): Promise<T> {
    const { token, headers, body, ...customConfig } = options || {};

    const config: AxiosRequestConfig = {
        url: endpoint,
        ...customConfig,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        data: body,
    };

    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    try {
        const response = await javaAPI.request<T>(config);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    }
}

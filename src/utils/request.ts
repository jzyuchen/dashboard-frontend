import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { RequestOptions, Result } from './types'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse<Result>) => {
    const { data, status } = response

    if (status === 200 || status === 201) {
      if (data.code === 200 || data.code === 0) {
        return data as any
      } else {
        console.error('Response error:', data.message)
        return Promise.reject(new Error(data.message || 'Request failed'))
      }
    } else {
      console.error('HTTP error:', status)
      return Promise.reject(new Error(`HTTP error: ${status}`))
    }
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          console.error('Unauthorized, redirecting to login...')
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          console.error('Forbidden:', data?.message || 'Access denied')
          break
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error('Request failed:', data?.message || error.message)
      }

      return Promise.reject(error)
    } else if (error.request) {
      console.error('No response received')
      return Promise.reject(new Error('Network error, please check your connection'))
    } else {
      console.error('Request setup error:', error.message)
      return Promise.reject(error)
    }
  }
)

export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return service.get(url, config) as Promise<T>
  },

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return service.post(url, data, config) as Promise<T>
  },

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return service.put(url, data, config) as Promise<T>
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return service.delete(url, config) as Promise<T>
  },

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return service.patch(url, data, config) as Promise<T>
  },
}

export default service

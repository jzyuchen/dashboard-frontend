export interface Result<T = any> {
  code: number
  message: string
  data: T
}

export interface RequestOptions {
  /**
   * 是否显示 loading
   * @default true
   */
  loading?: boolean
  /**
   * 是否处理结果
   * @default true
   */
  handleResult?: boolean
  /**
   * 请求成功提示信息
   */
  successMessage?: string
  /**
   * 请求错误提示信息
   */
  errorMessage?: string
}

export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

export interface PaginationResult<T> {
  list: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
  }
}

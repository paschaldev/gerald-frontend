import axios, { Method, AxiosResponse } from 'axios'

/**
 * API wrapper to make requests to the API. This just
 * wraps axios and unifies the response for every request
 * whether successful or in the event of an error
 *
 * @param {Method} method - The HTTP verb to use for the request
 * @param {String} path - The URL path. BaseURL is already prepended
 * @param {Object} data  - Request data for GET would be converted to params
 */
export const GeraldAPI = (
  method: Method,
  path: string,
  data?: any,
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    return axios({
      baseURL: process.env.API_URL || 'http://localhost:3000',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: path,
      method,
      data,
    }).then((response) => {
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { DefaultService } from './services/DefaultService';
import { ApiRequestOptions } from './core/ApiRequestOptions';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class Mokkiovi {

    public readonly default: DefaultService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '0.1.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.default = new DefaultService(this.request);
    }
}

const getAccessToken = async(options: ApiRequestOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
        const storageToken = localStorage.getItem('token');
        if (storageToken) {
            resolve(storageToken)
        }
        else {
            resolve('')
        }
    })

}

const BackendConfig: OpenAPIConfig =  {
    BASE: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
    VERSION: '0.1.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'include',
    TOKEN: getAccessToken,
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: undefined,
    ENCODE_PATH: undefined,
} 

const MokkioviService = new Mokkiovi(BackendConfig)

export default MokkioviService
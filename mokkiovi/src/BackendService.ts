import { OpenAPIConfig, Mokkiovi } from "./openapi";

const BackendConfig: OpenAPIConfig =  {
    BASE: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
    VERSION: '0.1.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'include',
    TOKEN: undefined,
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: undefined,
    ENCODE_PATH: undefined,
} 

const BackEndService = new Mokkiovi(BackendConfig)

export default BackEndService
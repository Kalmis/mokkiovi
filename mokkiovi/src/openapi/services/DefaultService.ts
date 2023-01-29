/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoogleToken } from '../models/GoogleToken';
import type { TestLogin } from '../models/TestLogin';
import type { Token } from '../models/Token';
import type { User } from '../models/User';
import type { Users } from '../models/Users';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Read Users Me
     * @returns User Successful Response
     * @throws ApiError
     */
    public readUsersMeUsersMeGet(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/me',
        });
    }

    /**
     * Login For Access Token With Test User
     * Endpoint for test environments where google sign in may not be used.
     * Simply sending the correct username will let the user login
     * @param requestBody
     * @returns Token Successful Response
     * @throws ApiError
     */
    public loginForAccessTokenWithTestUserTokenTestPost(
        requestBody: TestLogin,
    ): CancelablePromise<Token> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/token/test',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Login For Access Token With Google
     * @param requestBody
     * @returns Token Successful Response
     * @throws ApiError
     */
    public loginForAccessTokenWithGoogleTokenGooglePost(
        requestBody: GoogleToken,
    ): CancelablePromise<Token> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/token/google',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Users
     * @returns Users Successful Response
     * @throws ApiError
     */
    public getUsersUsersGet(): CancelablePromise<Users> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users',
        });
    }

}

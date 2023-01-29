/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserRoleWithoutId } from './UserRoleWithoutId';

export type User = {
    email: string;
    picture_url: string;
    given_name: string;
    family_name: string;
    id: number;
    roles: Array<UserRoleWithoutId>;
};


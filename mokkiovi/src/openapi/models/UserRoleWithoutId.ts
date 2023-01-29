/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RolesEnum } from './RolesEnum';

export type UserRoleWithoutId = {
    role: RolesEnum;
    valid_from: string;
    valid_until?: string;
};


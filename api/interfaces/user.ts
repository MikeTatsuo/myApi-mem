import { BaseObject } from './base.object';

export interface User extends BaseObject {
	email: string;
	password?: string;
	username?: string;
	permissionLevel?: string;
	provider?: string;
}

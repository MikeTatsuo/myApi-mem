import { BaseObject } from './base.object';

export interface CRUD<T> {
	create: (resource: T) => T;
	deleteById: (resourceId: string) => BaseObject;
	getById: (resourceId: string) => T;
	getByParam: (param: string, value: unknown) => T;
	list: (limit?: number, page?: number) => T[];
	patchById: (resourceId: string, resource: T) => T;
	updateById: (resourceId: string, resource: T) => T;
}

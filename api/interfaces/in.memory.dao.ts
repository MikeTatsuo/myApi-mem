import { BaseObject } from '../interfaces';

export interface GenericInMemoryDaoInterface {
	dao: any[];
	add<T>(dao: T): T;
	getById<T>(daoId: number): T;
	getByParams<T>(param: string, value: unknown): T;
	getList<T>(limit: number, page: number): T[];
	patchById<T>(daoId: number, dao: T): T;
	putById<T>(daoId: number, dao: T): T;
	removeById(daoId: number): BaseObject;
}

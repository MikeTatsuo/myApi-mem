import { EmptyObject, BaseObject, GenericInMemoryDaoInterface } from '../interfaces';

export class GenericInMemoryDao implements GenericInMemoryDaoInterface {
	dao: any[] = [];

	add<T>(dao: T): T {
		const daoId = this.dao.length + 1;
		dao = {
			id: daoId,
			...dao,
		};
		const index = this.dao.push(dao) - 1;
		return this.dao[index];
	}

	getById<T>(daoId: number): T {
		return this.dao.find(({ id }: EmptyObject) => id === daoId);
	}

	getByParams<T>(param: string, value: unknown): T {
		return this.dao.find((object: EmptyObject) => object[param] === value);
	}

	getList<T>(limit?: number, page?: number): T[] {
		const end = limit && page ? limit * page : 0;
		const start = page === 1 ? 0 : end - (limit ?? 0) - 1;

		const returnList = limit && page ? this.dao.slice(start, end) : this.dao;

		return returnList;
	}

	patchById<T>(daoId: number, dao: T): T {
		const patchedList = this.dao.map((data: EmptyObject) =>
			data.id === daoId ? { ...data, ...dao } : data
		) as T[];
		this.dao = patchedList;

		return this.dao.find(({ id }: EmptyObject) => id === daoId);
	}

	putById<T>(daoId: number, dao: T): T {
		const updatedList: T[] = this.dao.map((data: EmptyObject) =>
			data.id === daoId ? dao : data
		) as T[];
		this.dao = updatedList;

		return this.dao.find(({ id }: EmptyObject) => id === daoId);
	}

	removeById(daoId: number): BaseObject {
		const objIndex: number = this.dao.findIndex(({ id }: { id: number }) => id === daoId);
		const obj: BaseObject = { id: this.dao[objIndex].id };
		this.dao.splice(objIndex, 1);

		return obj;
	}
}

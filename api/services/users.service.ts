import { GenericInMemoryDao } from '../dao';
import { CRUD, BaseObject, User } from '../interfaces';

export class UsersService implements CRUD<User> {
	private static instance: UsersService;
	dao: GenericInMemoryDao;

	constructor() {
		this.dao = GenericInMemoryDao.getInstance();
	}

	static getInstance(): UsersService {
		if (!UsersService.instance) UsersService.instance = new UsersService();

		return UsersService.instance;
	}

	create(resource: User): User {
		return this.dao.add<User>(resource);
	}

	deleteById(resourceId: string): BaseObject {
		const userId = Number(resourceId);

		return this.dao.removeById(userId);
	}

	list(limit = 20, page = 1): User[] {
		return this.dao.getList<User>(limit, page);
	}

	patchById(resourceId: string, resource: User): User {
		const userId = Number(resourceId);
		const { id, username, email, password } = resource;
		resource = { ...resource, id: Number(id) };

		if (username) resource = { ...resource, username };
		if (email) resource = { ...resource, email };
		if (password) resource = { ...resource, password };

		return this.dao.patchById<User>(userId, resource);
	}

	getById(resourceId: string): User {
		const userId = Number(resourceId);

		return this.dao.getById<User>(userId);
	}

	getByParam(param: string, value: unknown): User {
		return this.dao.getByParams<User>(param, value);
	}

	updateById(resourceId: string, resource: User): User {
		const userId = Number(resourceId);
		const { id, username, email, password } = resource;
		resource = { id: Number(id), username, email, password };

		return this.dao.putById<User>(userId, resource);
	}

	formatUser(user: User): User {
		const formattedUser: User = { ...user };

		if (user) delete formattedUser.password;

		return formattedUser;
	}
}

import { UserDao } from '../dao';
import { CRUD, BaseObject, User } from '../interfaces';

export class UsersService implements CRUD<User> {
	private static instance: UsersService;
	userDao: UserDao;

	constructor() {
		this.userDao = UserDao.getInstance();
	}

	static getInstance(): UsersService {
		if (!UsersService.instance) UsersService.instance = new UsersService();

		return UsersService.instance;
	}

	create(resource: User): User {
		return this.userDao.add<User>(resource);
	}

	deleteById(resourceId: string): BaseObject {
		const userId = Number(resourceId);

		return this.userDao.removeById(userId);
	}

	list(limit = 20, page = 1): User[] {
		return this.userDao.getList<User>(limit, page);
	}

	patchById(resourceId: string, resource: User): User {
		const userId = Number(resourceId);
		const { id, username, email, password } = resource;
		resource = { ...resource, id: Number(id) };

		if (username) resource = { ...resource, username };
		if (email) resource = { ...resource, email };
		if (password) resource = { ...resource, password };

		return this.userDao.patchById<User>(userId, resource);
	}

	getById(resourceId: string): User {
		const userId = Number(resourceId);

		return this.userDao.getById<User>(userId);
	}

	getByParam(param: string, value: unknown): User {
		return this.userDao.getByParams<User>(param, value);
	}

	updateById(resourceId: string, resource: User): User {
		const userId = Number(resourceId);
		const { id, username, email, password } = resource;
		resource = { id: Number(id), username, email, password };

		return this.userDao.putById<User>(userId, resource);
	}

	formatUser(user: User): User {
		const formattedUser: User = { ...user };

		if (user) delete formattedUser.password;

		return formattedUser;
	}
}

import { GenericInMemoryDao } from './in.memory.dao';

export class UserDao extends GenericInMemoryDao {
	private static instance: UserDao;

	static getInstance(): UserDao {
		if (!UserDao.instance) UserDao.instance = new UserDao();

		return UserDao.instance;
	}
}

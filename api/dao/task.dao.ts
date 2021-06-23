import { GenericInMemoryDao } from './in.memory.dao';

export class TaskDao extends GenericInMemoryDao {
	private static instance: TaskDao;

	static getInstance(): TaskDao {
		if (!TaskDao.instance) TaskDao.instance = new TaskDao();

		return TaskDao.instance;
	}
}

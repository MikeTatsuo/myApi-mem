import { GenericInMemoryDao } from './in.memory.dao';

export class TaskTimeDao extends GenericInMemoryDao {
	private static instance: TaskTimeDao;

	static getInstance(): TaskTimeDao {
		if (!TaskTimeDao.instance) TaskTimeDao.instance = new TaskTimeDao();

		return TaskTimeDao.instance;
	}
}

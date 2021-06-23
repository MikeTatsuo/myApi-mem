import { GenericInMemoryDao } from './in.memory.dao';

export class TimeTableDao extends GenericInMemoryDao {
	private static instance: TimeTableDao;

	static getInstance(): TimeTableDao {
		if (!TimeTableDao.instance) TimeTableDao.instance = new TimeTableDao();

		return TimeTableDao.instance;
	}
}

import { GenericInMemoryDao } from './in.memory.dao';

export class HistoryDao extends GenericInMemoryDao {
	private static instance: HistoryDao;
	dao: any[] = [];

	static getInstance(): HistoryDao {
		if (!HistoryDao.instance) HistoryDao.instance = new HistoryDao();

		return HistoryDao.instance;
	}
}

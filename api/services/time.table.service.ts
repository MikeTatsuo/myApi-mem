import { TimeTableDao } from '../dao';
import { CRUD, BaseObject, TaskTime } from '../interfaces';

export class TimeTableService implements CRUD<TaskTime> {
	private static instance: TimeTableService;
	timeTableDao: TimeTableDao;

	constructor() {
		this.timeTableDao = TimeTableDao.getInstance();
	}

	static getInstance(): TimeTableService {
		if (!TimeTableService.instance) TimeTableService.instance = new TimeTableService();

		return TimeTableService.instance;
	}

	create(resource: TaskTime): TaskTime {
		return this.timeTableDao.add<TaskTime>(resource);
	}

	deleteById(resouceId: string): BaseObject {
		const taskId = Number(resouceId);

		return this.timeTableDao.removeById(taskId);
	}

	list(): TaskTime[] {
		return this.timeTableDao.getList<TaskTime>();
	}

	listByTaskId(taskId: number): TaskTime[] {
		const timeTableList = this.timeTableDao.getList<TaskTime>();
		return timeTableList.filter((taskTime: TaskTime) => taskTime.taskId === taskId);
	}

	patchById(resourceId: string, resource: TaskTime): TaskTime {
		const timeTableId = Number(resourceId);
		const { id, end, start, taskId } = resource;
		resource = { ...resource, id: Number(id) };

		if (end) resource = { ...resource, end };
		if (start) resource = { ...resource, start };
		if (taskId) resource = { ...resource, taskId };

		return this.timeTableDao.patchById<TaskTime>(timeTableId, resource);
	}

	getById(resourceId: string): TaskTime {
		const taskId = Number(resourceId);

		return this.timeTableDao.getById<TaskTime>(taskId);
	}

	getByParam(param: string, value: unknown): TaskTime {
		return this.timeTableDao.getByParams<TaskTime>(param, value);
	}

	updateById(resourceId: string, resource: TaskTime): TaskTime {
		const timeTableId = Number(resourceId);
		const { id, end, start, taskId } = resource;
		resource = { id: Number(id), end, start, taskId };

		return this.timeTableDao.putById<TaskTime>(timeTableId, resource);
	}

	formatTimeTable(task: TaskTime): TaskTime {
		const formattedTask: TaskTime = { ...task };

		if (!task.end) delete formattedTask.end;

		return formattedTask;
	}
}

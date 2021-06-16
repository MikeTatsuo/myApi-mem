import { BaseObject } from './base.object';
import { TaskTime } from './task.time';

export interface Task extends BaseObject {
	finished: boolean;
	name: string;
	observation?: string;
	timeTable: TaskTime[];
}

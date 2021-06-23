import { BaseObject } from './base.object';
import { TaskTime } from './task.time';

export interface Task extends BaseObject {
	finished: boolean;
	name: string;
	historyId?: number;
	observation?: string;
	timeTable?: TaskTime[];
}

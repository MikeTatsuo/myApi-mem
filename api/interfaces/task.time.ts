import { BaseObject } from './base.object';

export interface TaskTime extends BaseObject {
	end?: Date;
	start: Date;
	taskId: number;
}

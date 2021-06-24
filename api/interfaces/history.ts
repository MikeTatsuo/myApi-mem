import { BaseObject } from './base.object';
import { Task } from './task';

export interface History extends BaseObject {
	finished: boolean;
	name: string;
	tasks?: Task[];
}

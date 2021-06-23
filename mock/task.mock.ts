export const TaskMock = {
	firstTask: {
		finished: false,
		name: 'Task 1',
		historyId: 1,
		observation: 'Observation 1',
		timeTable: [
			{
				end: new Date('2021-06-22'),
				start: new Date('2021-06-21'),
				taskId: 1,
			},
		],
	},
	secondTask: {
		finished: false,
		name: 'Task 2',
		historyId: 2,
		observation: 'Observation 2',
		timeTable: [
			{
				end: new Date('2021-06-22'),
				start: new Date('2021-05-22'),
				taskId: 2,
			},
			{
				end: new Date('2021-06-22'),
				start: new Date('2021-04-22'),
				taskId: 3,
			},
		],
	},
	thirdTask: {
		finished: true,
		name: 'Task 3',
		historyId: 3,
		observation: 'Observation 3',
		timeTable: [
			{
				end: new Date('2021-06-22'),
				start: new Date('2020-06-22'),
				taskId: 4,
			},
			{
				end: new Date('2021-06-22'),
				start: new Date('2019-06-22'),
				taskId: 5,
			},
			{
				end: new Date('2021-06-22'),
				start: new Date('2018-06-22'),
				taskId: 6,
			},
		],
	},
};

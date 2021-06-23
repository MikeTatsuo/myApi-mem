import server from '../../server';
import { agent as request, Response } from 'supertest';
import { assert, expect } from 'chai';
import { Endpoints, HttpCodes } from '../../api/common';
import { EnumOfTypes } from '../../api/interfaces';
import { TaskMock, UserMock } from '../../mock';

const header = { Authorization: 'Bearer ' };
const { auth, task, user } = Endpoints;
const { firstUser } = UserMock;
const { CREATED, OK } = HttpCodes;
const { ARRAY, BOOLEAN, NUMBER, OBJECT, STRING } = EnumOfTypes;
const { username, email, password } = firstUser;
const { firstTask, secondTask, thirdTask } = TaskMock;

let firstUserId: number;
let firstTaskId: number;

beforeEach(() => {
	class MockDate extends Date {
		constructor(date: Date) {
			super(date);
		}
	}

	global.Date = MockDate as DateConstructor;
});

describe('task.test', () => {
	describe(`POST ${user}`, () => {
		it('should return 201 - Created', (done) => {
			request(server)
				.post(user)
				.send(firstUser)
				.then(({ status, body }: Response) => {
					const { id } = body;

					expect(status).to.equal(CREATED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equal(username);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equal(email);
					expect(body).not.haveOwnProperty('password');

					firstUserId = id;

					done();
				})
				.catch(done);
		});
	});

	describe(`POST ${auth}`, () => {
		it('should return 201 - Created', (done) => {
			request(server)
				.post(auth)
				.send({ email, password })
				.then(({ body, status }: Response) => {
					const { accessToken } = body;

					expect(status).to.equal(CREATED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(accessToken).to.be.an(STRING);

					header.Authorization += accessToken;

					done();
				})
				.catch(done);
		});
	});

	describe(`POST ${task}`, () => {
		it('should return 201 - Created', (done) => {
			request(server)
				.post(task)
				.set(header)
				.send(firstTask)
				.then(({ body, status }: Response) => {
					const { id, finished, name, observation, timeTable } = body;

					expect(status).to.equal(CREATED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(finished).to.be.an(BOOLEAN);
					expect(finished).to.be.equal(firstTask.finished);
					expect(name).to.be.an(STRING);
					expect(name).to.be.equal(firstTask.name);
					expect(observation).to.be.an(STRING);
					expect(observation).to.be.equal(firstTask.observation);
					expect(timeTable).to.be.an(ARRAY);
					expect(timeTable.length).to.be.equal(1);

					const time = timeTable.pop();
					const { end, start, taskId } = time;

					expect(time.id).to.be.an(NUMBER);
					expect(end).not.to.be.empty;
					assert.deepEqual(new Date(end), new Date(firstTask.timeTable[0].end));
					expect(start).not.to.be.empty;
					assert.deepEqual(new Date(start), new Date(firstTask.timeTable[0].start));
					expect(taskId).to.be.an(NUMBER);
					expect(taskId).to.be.equal(firstTask.timeTable[0].taskId);

					firstTaskId = id;

					done();
				})
				.catch(done);
		});
	});

	// describe(`DELETE ${task}/:taskId`, () => {

	// })

	describe(`DELETE ${user}/:userId`, () => {
		it('should return 200 - Ok', (done) => {
			request(server)
				.delete(`${user}/${firstUserId}`)
				.set(header)
				.send()
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.equal(OK);
					expect(body).to.not.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);

					done();
				})
				.catch(done);
		});
	});
});

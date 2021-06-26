import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { Endpoints, ErrorMsgs, HttpCodes } from '../../api/common';
import { EnumOfTypes } from '../../api/interfaces';
import { TaskMock, UserMock } from '../../mock';

const header = { Authorization: 'Bearer ' };
const { auth, task, user } = Endpoints;
const { firstUser } = UserMock;
const { BAD_REQUEST, CREATED, FORBIDDEN, UNAUTHORIZED } = HttpCodes;
const { ARRAY, BOOLEAN, NUMBER, OBJECT, STRING } = EnumOfTypes;
const { email, password } = firstUser;
const { firstTask } = TaskMock;
const {
	authRequired,
	invalidBody,
	invalidSignature,
	missingFinished,
	missingName,
	missingNameAndFinished,
	taskExist,
} = ErrorMsgs;
const { name, finished, historyId, observation } = firstTask;
const req = request(server);

let firstUserId: number;
let firstTaskId: number;

describe('task.post.test', () => {
	describe(`POST ${task}`, () => {
		it('should return 201 - Created', (done) => {
			req
				.post(user)
				.send(firstUser)
				.then(({ body }: Response) => {
					const { id } = body;
					firstUserId = id;

					req
						.post(auth)
						.send({ email, password })
						.then(({ body }: Response) => {
							const { accessToken } = body;
							header.Authorization += accessToken;

							req
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
									expect(timeTable.length).to.be.equal(0);

									firstTaskId = id;

									done();
								})
								.catch(done);
						})
						.catch(done);
				})
				.catch(done);
		});

		it('should return 403 - Forbidden - invalid JWT', (done) => {
			req
				.post(task)
				.set({ Authorization: `${header.Authorization}123` })
				.send()
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(FORBIDDEN);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidSignature);

					done();
				})
				.catch(done);
		});

		it('should return 401 - Unauthorized - no JWT set', (done) => {
			req
				.post(task)
				.send()
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(UNAUTHORIZED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(authRequired);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - name exists', (done) => {
			req
				.post(task)
				.set(header)
				.send(firstTask)
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(taskExist);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing name', (done) => {
			req
				.post(task)
				.set(header)
				.send({ finished, historyId, observation })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingName);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing finished', (done) => {
			req
				.post(task)
				.set(header)
				.send({ name, historyId, observation })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingFinished);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing name and finished', (done) => {
			req
				.post(task)
				.set(header)
				.send({ historyId, observation })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingNameAndFinished);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - invalid body request', (done) => {
			req
				.post(task)
				.set(header)
				.send()
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidBody);

					req
						.delete(`${task}/${firstTaskId}`)
						.set(header)
						.send()
						.then(() => {
							req
								.delete(`${user}/${firstUserId}`)
								.set(header)
								.send()
								.then(() => {
									done();
								})
								.catch(done);
						})
						.catch(done);
				})
				.catch(done);
		});
	});
});

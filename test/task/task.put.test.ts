import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { Endpoints, ErrorMsgs, HttpCodes } from '../../api/common';
import { EnumOfTypes } from '../../api/interfaces';
import { TaskMock, UserMock } from '../../mock';

let firstUserId: number;
let firstTaskId: number;
let secondTaskId: number;

const header = { Authorization: 'Bearer ' };
const { auth, task, user } = Endpoints;
const { firstUser } = UserMock;
const { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } = HttpCodes;
const { BOOLEAN, NUMBER, OBJECT, STRING } = EnumOfTypes;
const { email, password } = firstUser;
const { firstTask, secondTask, thirdTask } = TaskMock;
const {
	authRequired,
	invalidBody,
	invalidSignature,
	missingFinished,
	missingName,
	missingNameAndFinished,
	missingParamId,
	taskExist,
	taskNotFound,
} = ErrorMsgs;
const { name, finished, historyId, observation } = thirdTask;
const req = request(server);

describe('task.put.test', () => {
	describe(`PUT ${task}`, () => {
		it('should return 200 - OK', (done) => {
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
								.then(({ body }: Response) => {
									const { id } = body;
									firstTaskId = id;

									req
										.post(task)
										.set(header)
										.send(secondTask)
										.then(({ body }: Response) => {
											const { id } = body;
											secondTaskId = id;

											req
												.put(`${task}/${firstTaskId}`)
												.set(header)
												.send(thirdTask)
												.then(({ body, status }: Response) => {
													const { id } = body;

													expect(status).to.equal(OK);
													expect(body).not.to.be.empty;
													expect(body).to.be.an(OBJECT);
													expect(id).to.be.an(NUMBER);
													expect(id).to.be.equal(firstTaskId);
													expect(body.name).to.be.an(STRING);
													expect(body.name).to.be.equal(name);
													expect(body.finished).to.be.an(BOOLEAN);
													expect(body.finished).to.be.equal(finished);
													expect(body.historyId).to.be.an(NUMBER);
													expect(body.historyId).to.be.equal(historyId);
													expect(body.observation).to.be.an(STRING);
													expect(body.observation).to.be.equal(observation);

													done();
												})
												.catch(done);
										})
										.catch(done);
								})
								.catch(done);
						})
						.catch(done);
				})
				.catch(done);
		});

		it('should return 403 - Forbidden - invalid JWT', (done) => {
			req
				.put(`${task}/${firstTaskId}`)
				.set({ authorization: `${header.Authorization}123` })
				.send(firstTask)
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
				.put(`${task}/${firstTaskId}`)
				.send(firstTask)
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

		it('should return 400 - Bad Request - missing name', (done) => {
			req
				.put(`${task}/${firstTaskId}`)
				.set(header)
				.send({
					finished: firstTask.finished,
					historyId: firstTask.historyId,
					observation: firstTask.observation,
				})
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
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
				.put(`${task}/${firstTaskId}`)
				.set(header)
				.send({
					name: firstTask.name,
					historyId: firstTask.historyId,
					observation: firstTask.observation,
				})
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
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
				.put(`${task}/${firstTaskId}`)
				.set(header)
				.send({ historyId: firstTask.historyId, observation: firstTask.observation })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingNameAndFinished);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - empty body', (done) => {
			req
				.put(`${task}/${firstTaskId}`)
				.set(header)
				.send()
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidBody);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - name exists', (done) => {
			req
				.put(`${task}/${firstTaskId}`)
				.set(header)
				.send({ ...firstTask, name: secondTask.name })
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

		it('should return 400 - Bad Request - missing param id', (done) => {
			req
				.put(task)
				.set(header)
				.send(firstTask)
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingParamId);

					done();
				})
				.catch(done);
		});

		it('should return 404 - Not Found - task not found', (done) => {
			req
				.delete(`${task}/${firstTaskId}`)
				.set(header)
				.send()
				.then(() => {
					req
						.put(`${task}/${firstTaskId}`)
						.set(header)
						.send(firstTask)
						.then(({ body, status }: Response) => {
							const { error } = body;

							expect(status).to.equal(NOT_FOUND);
							expect(body).not.to.be.empty;
							expect(body).to.be.an(OBJECT);
							expect(error).to.be.an(STRING);
							expect(error).to.be.equal(taskNotFound);

							req
								.delete(`${task}/${secondTaskId}`)
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
				})
				.catch(done);
		});
	});
});

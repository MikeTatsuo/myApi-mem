import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { Endpoints, ErrorMsgs, HttpCodes } from '../../api/common';
import { EnumOfTypes } from '../../api/interfaces';
import { TaskMock, UserMock } from '../../mock';

let firstUserId: number;
let firstTaskId: number;

const header = { Authorization: 'Bearer ' };
const { auth, task, user } = Endpoints;
const { firstUser } = UserMock;
const { NOT_FOUND, OK, UNAUTHORIZED } = HttpCodes;
const { BOOLEAN, NUMBER, OBJECT, STRING } = EnumOfTypes;
const { email, password } = firstUser;
const { firstTask } = TaskMock;
const { authRequired, invalidSignature, taskNotFound } = ErrorMsgs;
const invalidTaskId = 0;

const req = request(server);

describe('task.get.test', () => {
	describe(`GET ${task}`, () => {
		it('should return 200 - Ok', (done) => {
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
										.get(`${task}/${firstTaskId}`)
										.set(header)
										.send()
										.then(({ body, status }) => {
											const { id, finished, name, historyId, observation } = body;

											expect(status).to.equal(OK);
											expect(body).not.to.be.empty;
											expect(body).to.be.an(OBJECT);
											expect(id).to.be.an(NUMBER);
											expect(id).to.be.equal(firstTaskId);
											expect(finished).to.be.an(BOOLEAN);
											expect(finished).to.be.equal(finished);
											expect(name).to.be.an(STRING);
											expect(name).to.be.equal(name);
											expect(historyId).to.be.equal(historyId);
											expect(observation).to.be.an(STRING);
											expect(observation).to.be.equal(observation);

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

		it('should return 403 - Forbidden - invalid JWT', (done) => {
			req
				.get(`${task}/${firstTaskId}`)
				.set({ authorization: `${header.Authorization}123` })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(status);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidSignature);

					done();
				})
				.catch(done);
		});

		it('should return 401 - Unauthorized - no JWT set', () => {
			req
				.get(`${task}/${firstTaskId}`)
				.send()
				.then(({ body, status }) => {
					const { error } = body;

					expect(status).to.equal(UNAUTHORIZED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(authRequired);
				});
		});

		it('should return 404 - Not Found - task not found', (done) => {
			req
				.get(`${task}/${invalidTaskId}`)
				.set(header)
				.send()
				.then(({ body, status }) => {
					const { error } = body;

					expect(status).to.equal(NOT_FOUND);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(taskNotFound);

					req
						.delete(`${task}/${firstTaskId}`)
						.set(header)
						.send()
						.then(({ body, status }: Response) => {
							const { id } = body;

							expect(status).to.equal(OK);
							expect(body).to.not.be.empty;
							expect(body).to.be.an(OBJECT);
							expect(id).to.be.an(NUMBER);
							expect(id).to.be.equal(firstTaskId);

							req
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
						})
						.catch(done);
				})
				.catch(done);
		});
	});
});

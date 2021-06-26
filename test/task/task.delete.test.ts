import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { Endpoints, ErrorMsgs, HttpCodes } from '../../api/common';
import { EnumOfTypes } from '../../api/interfaces';
import { TaskMock, UserMock } from '../../mock';

const header = { Authorization: 'Bearer ' };
const { auth, task, user } = Endpoints;
const { firstUser } = UserMock;
const { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } = HttpCodes;
const { NUMBER, OBJECT, STRING } = EnumOfTypes;
const { email, password } = firstUser;
const { firstTask } = TaskMock;
const { authRequired, invalidSignature, missingParamId, taskNotFound } = ErrorMsgs;

let firstUserId: number;
let firstTaskId: number;
const req = request(server);

describe('task.delete.test', () => {
	describe(`DELETE ${task}/:taskId`, () => {
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
				.delete(`${task}/${firstTaskId}`)
				.set({ authorization: `${header.Authorization}123` })
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
				.delete(`${task}/${firstTaskId}`)
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

		it('should return 400 - Bad Request - missing param id', (done) => {
			req
				.delete(task)
				.set(header)
				.send()
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
				.then((res: Response) => {
					const { status, body } = res;
					const { error } = body;

					expect(status).to.equal(NOT_FOUND);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(taskNotFound);

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
		});
	});
});

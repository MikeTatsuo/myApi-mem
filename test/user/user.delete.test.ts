import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { EnumOfTypes } from '../../api/interfaces';
import { Endpoints, ErrorMsgs, HttpCodes } from '../../api/common';
import { UserMock } from '../../mock';

let firstUserId = 0;

const header = { Authorization: 'Bearer ' };
const { firstUser, secondUser } = UserMock;
const { email, password } = firstUser;
const { NUMBER, OBJECT, STRING } = EnumOfTypes;
const { auth, user } = Endpoints;
const { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } = HttpCodes;
const { authRequired, invalidSignature, missingParamId, userNotFound } = ErrorMsgs;
const req = request(server);

describe('user.delete.test', () => {
	describe(`DELETE ${user}/:userId`, () => {
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
								.delete(`${user}/${firstUserId}`)
								.set(header)
								.send()
								.then((res: Response) => {
									const { status, body } = res;
									const { id } = body;

									expect(status).to.equal(OK);
									expect(body).not.to.be.empty;
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

		it('should return 403 - Forbidden - invalid JWT', (done) => {
			req
				.delete(`${user}/${firstUserId}`)
				.set({ Authorization: `${header.Authorization}123` })
				.send(secondUser)
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
				.delete(`${user}/${firstUserId}`)
				.send(secondUser)
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
				.delete(user)
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

		it('should return 404 - Not Found - user not found', (done) => {
			req
				.delete(`${user}/${firstUserId}`)
				.set(header)
				.send()
				.then((res: Response) => {
					const { status, body } = res;
					const { error } = body;

					expect(status).to.equal(NOT_FOUND);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(userNotFound);

					done();
				})
				.catch(done);
		});
	});
});

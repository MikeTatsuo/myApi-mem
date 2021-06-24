import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { EnumOfTypes } from '../../api/interfaces';
import { Endpoints, ErrorMsgs, HttpCodes } from '../../api/common';
import { UserMock } from '../../mock';

let firstUserId = 0;
const invalidUserId = 0;

const header = { Authorization: 'Bearer ' };
const { firstUser } = UserMock;
const { username, email, password } = firstUser;
const { ARRAY, NUMBER, OBJECT, STRING } = EnumOfTypes;
const { auth, user, users } = Endpoints;
const { CREATED, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } = HttpCodes;
const { authRequired, invalidSignature, userNotFound } = ErrorMsgs;

describe('user.get.test', () => {
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
					const { accessToken, refreshToken } = body;

					expect(status).to.equal(CREATED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(accessToken).to.be.an(STRING);
					expect(refreshToken).to.be.an(STRING);

					header.Authorization += accessToken;
					done();
				})
				.catch(done);
		});
	});

	describe(`GET ${user}/:userId`, () => {
		it('should return 200 - Ok', (done) => {
			request(server)
				.get(`${user}/${firstUserId}`)
				.set(header)
				.send()
				.then(({ body, status }: Response) => {
					expect(status).to.equal(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(body.id).to.be.an(NUMBER);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equal(username);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equal(email);
					expect(body).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});

		it('should return 403 - Forbidden - invalid JWT', (done) => {
			request(server)
				.get(`${user}/${firstUserId}`)
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
			request(server)
				.get(`${user}/${firstUserId}`)
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

		it('should return 404 - Not Found - user not found', (done) => {
			request(server)
				.get(`${user}/${invalidUserId}`)
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

	describe(`DELETE ${user}/:userId`, () => {
		it('should return 200 - Ok', (done) => {
			request(server)
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
		});
	});

	describe(`GET ${users}`, () => {
		it('should return 200 - Ok - and body to be empty', (done) => {
			request(server)
				.get(users)
				.set(header)
				.send()
				.then((res: Response) => {
					const { status, body } = res;

					expect(status).to.equal(OK);
					expect(body).to.be.an(ARRAY);
					expect(body).to.be.empty;

					done();
				})
				.catch(done);
		});
	});
});

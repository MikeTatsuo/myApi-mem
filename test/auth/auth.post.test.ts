import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { Endpoints, ErrorMsgs, HttpCodes } from '../../api/common';
import { EnumOfTypes } from '../../api/interfaces';

let firstUserId = 0;

const firstUserBody = {
	username: 'Username 1',
	email: 'user@1.com',
	password: 'Password1',
};

const invalidUserBody = {
	email: 'invalid@user.com',
	password: 'invalidPassword',
};

const header = { Authorization: 'Bearer ' };
const { email, password } = firstUserBody;
const { auth, user } = Endpoints;
const { OBJECT, NUMBER, STRING } = EnumOfTypes;
const { BAD_REQUEST, CREATED, OK } = HttpCodes;
const { invalidEmailPasswd, missingEmail, missingPasswd, missingEmailAndPasswd } = ErrorMsgs;
const req = request(server);

describe('auth.post.test', () => {
	describe(`POST ${auth}`, () => {
		it('should return 201 - Created', (done) => {
			req
				.post(user)
				.send(firstUserBody)
				.then(({ body }: Response) => {
					const { id } = body;
					firstUserId = id;

					req
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
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing email', (done) => {
			req
				.post(auth)
				.send({ password })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingEmail);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing password', (done) => {
			req
				.post(auth)
				.send({ email })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingPasswd);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing email and password', (done) => {
			req
				.post(auth)
				.send()
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingEmailAndPasswd);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - invalid email', (done) => {
			req
				.post(auth)
				.send({ email: invalidUserBody.email, password })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidEmailPasswd);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - invalid password', (done) => {
			req
				.post(auth)
				.send({ email, password: invalidUserBody.password })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidEmailPasswd);

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
		});
	});
});

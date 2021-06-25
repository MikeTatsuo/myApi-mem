import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { EnumOfTypes } from '../../api/interfaces';
import { Endpoints, HttpCodes } from '../../api/common';
import { UserMock } from '../../mock';

let firstUserId = 0;
let secondUserId = 0;

const header = { Authorization: 'Bearer ' };
const { firstUser, secondUser } = UserMock;
const { email, password } = firstUser;
const { ARRAY, NUMBER, STRING } = EnumOfTypes;
const { users, user, auth } = Endpoints;
const { OK } = HttpCodes;
const req = request(server);

describe('users.get.test', () => {
	describe(`GET ${users}`, () => {
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
								.get(users)
								.set(header)
								.send()
								.then((res: Response) => {
									const { status, body } = res;

									expect(status).to.equal(OK);
									expect(body).not.to.be.empty;
									expect(body).to.be.an(ARRAY);

									const lastUser = body[body.length - 1];
									const { id, username, email } = lastUser;

									expect(id).to.be.an(NUMBER);
									expect(username).to.be.an(STRING);
									expect(username).to.be.equal(firstUser.username);
									expect(email).to.be.an(STRING);
									expect(email).to.be.equal(firstUser.email);
									expect(lastUser).not.haveOwnProperty('password');

									done();
								})
								.catch(done);
						})
						.catch(done);
				})
				.catch(done);
		});

		it('should return 200 - Ok - 2 Users', (done) => {
			req
				.post(user)
				.send(secondUser)
				.then(({ body }: Response) => {
					const { id } = body;
					secondUserId = id;

					req
						.get(users)
						.set(header)
						.send()
						.then((res: Response) => {
							const { status, body } = res;

							expect(status).to.equal(OK);
							expect(body).not.to.be.empty;
							expect(body).to.be.an(ARRAY);
							expect(body.length).to.be.equal(2);

							done();
						})
						.catch(done);
				})
				.catch(done);
		});

		it('should return 200 - Ok - and body to be empty', (done) => {
			req
				.delete(`${user}/${firstUserId}`)
				.set(header)
				.send()
				.then(() => {
					req
						.delete(`${user}/${secondUserId}`)
						.set(header)
						.send()
						.then(() => {
							req
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
						})
						.catch(done);
				})
				.catch(done);
		});
	});
});

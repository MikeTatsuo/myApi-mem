import { Application } from 'express';
import { Endpoints, RoutesConfig } from '../common';
import { AuthController } from '../controllers';
import { configureRoutes } from '../interfaces';
import { AuthMiddleware, JwtMiddleware } from '../middleware';

const { auth, authRefresh } = Endpoints;

export class AuthRoutes extends RoutesConfig implements configureRoutes {
	constructor(app: Application) {
		super(app, 'AuthRoute');
		this.configureRoutes();
	}

	configureRoutes(): void {
		const authController = new AuthController();
		const authMiddleware = AuthMiddleware.getInstance();
		const jwtMiddleware = JwtMiddleware.getInstance();

		this.app.post(auth, [
			authMiddleware.validateBodyRequest,
			authMiddleware.verifyUserPassword,
			authController.createJWT,
		]);

		this.app.post(`${auth}${authRefresh}`, [
			jwtMiddleware.validJWTNeeded,
			jwtMiddleware.verifyRefreshBodyField,
			jwtMiddleware.validRefreshNeeded,
			authController.createJWT,
		]);
	}
}

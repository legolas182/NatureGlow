import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { validateToken, isAdmin } from '../../middleware/authMiddleware';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {
            headers: {},
            user: undefined
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('validateToken', () => {
        it('should return 401 if no token is provided', async () => {
            await validateToken(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'No token provided'
            });
        });

        it('should return 401 if token is invalid', async () => {
            mockRequest.headers = {
                authorization: 'Bearer invalid_token'
            };
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await validateToken(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid token'
            });
        });

        it('should call next() if token is valid', async () => {
            mockRequest.headers = {
                authorization: 'Bearer valid_token'
            };
            const decodedToken = { id: 1, role: 'user' };
            (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

            await validateToken(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockRequest.user).toEqual(decodedToken);
        });
    });

    describe('isAdmin', () => {
        it('should return 403 if user is not admin', async () => {
            mockRequest.user = { id: 1, role: 'user' };

            await isAdmin(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Access denied. Admin role required.'
            });
        });

        it('should call next() if user is admin', async () => {
            mockRequest.user = { id: 1, role: 'admin' };

            await isAdmin(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });
    });
}); 
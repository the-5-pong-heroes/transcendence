import {api} from './api';

export const backend = {
	
	async patchUser(name: string, updateUser: unknown): Promise<any> {
		const response = await api.patch('/users/' + name, updateUser);
		return response.json();
	},

	async createUser(user: unknown): Promise<any> {
		const response = await api.post('/auth/Oauth', user);
		return await response.json();
	},

    async deleteTokenCookie(): Promise<any> {
		const response = await api.get('/auth/logout');
	},
	async getUserByToken(): Promise<any> {
		const response = await api.get('/auth/getuserbytoken');
		return await response.json();
	},
	async checkToken(): Promise<any> {
		const response = await api.get('/auth/token');
		return await response.json();
	},

    async generate2FA(user: unknown): Promise<any> {
		const response = await api.post('/2FA/sendEmail', user);
		return await response.json();
	},
	async verify2FA(user: unknown): Promise<any> {
		const response = await api.post('/2FA/verify', user);
		return await response.json();
	},
	async disable2FA(user: unknown): Promise<any> {
		const response = await api.post('/2FA/disable', user);
		return await response.json();
	},
}
import { adminApiClient } from "../apiClient";

class AuthService {
  async login(body: { username: string; password: string }) {
    return adminApiClient.post("api/auth/login", body);
  }
  async resetPassword(body: { token: string; username: string; password: string }) {
    return adminApiClient.post("api/auth/ResetPassword", body);
  }
  async getresetPasswordUrl(username: string) {
    return adminApiClient.post(`api/auth/GetResetPasswordUrl?username=${username}`, {});
  }
  async bookADemo(body: {email:string, fullname: string}) {
    return adminApiClient.post(`api/auth/bookDemo`, body);
  }
  async resetToDefaultPassword(username:string) {
    return adminApiClient.post(`api/auth/ResetToDefaultPassword/${username}`, {});
  }
  async getDetails(userId: string) {
    return adminApiClient.get(`api/auth/accountDetails/${userId}`);
  }

  async getRoles() {
    return adminApiClient.get(`api/auth/Roles`);
  }
}

export const authService = new AuthService();

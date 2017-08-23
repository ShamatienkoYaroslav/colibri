/* eslint-disable no-undef */

class Auth {
  constructor() {
    this.tokenKey = 'token';
    this.userNameKey = 'username';
    this.userIdKey = 'userId';
    this.userRoleKey = 'userRole';
    this.userSlugKey = 'userSlug';
  }

  // TOKEN

  getRoles() {
    return {
      ADMIN: 'admin',
      CHANGE: 'change',
    };
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  tokenIsSet() {
    return !!this.getToken();
  }

  // USER

  getUser() {
    return {
      name: localStorage.getItem(this.userNameKey) || '',
      id: localStorage.getItem(this.userIdKey) || '',
      role: localStorage.getItem(this.userRoleKey) || '',
      slug: localStorage.getItem(this.userSlugKey) || '',
    };
  }

  userIsAdmin() {
    return (this.getUser().role === this.getRoles().ADMIN) || false;
  }
 
  authUser(token, user, id, role, slug) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userNameKey, user);
    localStorage.setItem(this.userIdKey, id);
    localStorage.setItem(this.userRoleKey, role);
    localStorage.setItem(this.userSlugKey, slug);
  }

  unauthUser() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userNameKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userRoleKey);
    localStorage.removeItem(this.userSlugKey);
  }
}

export default new Auth();

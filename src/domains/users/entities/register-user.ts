interface RegisterUserPayload {
  username?: string;
  fullname?: string;
  password?: string;
}

class RegisterUser {
  username: string;
  fullname: string;
  password: string;

  constructor(payload: RegisterUserPayload) {
    this.verifyPayload(payload);

    const { username, fullname, password } = payload;

    this.username = username ?? '';
    this.fullname = fullname ?? '';
    this.password = password ?? '';
  }

  private verifyPayload(payload: RegisterUserPayload) {
    const { username, fullname, password } = payload;

    if (!username || !fullname || !password) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof username !== 'string' ||
      typeof fullname !== 'string' ||
      typeof password !== 'string'
    ) {
      throw new TypeError('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
    }

    if (/^[\w]+$/.test(username)) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }
  }
}

export { RegisterUser };

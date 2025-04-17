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

    this.username = username;
    this.fullname = fullname;
    this.password = password;
  }

  private verifyPayload(
    payload: RegisterUserPayload,
  ): asserts payload is Required<RegisterUserPayload> {
    const { username, fullname, password } = payload;

    if (!username || !fullname || !password) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
    }

    if (!/^[\w]+$/.test(username)) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }
  }
}

export { RegisterUser };

interface RegisteredUserPayload {
  id?: string;
  username?: string;
  fullname?: string;
}

class RegisteredUser {
  id: string;
  username: string;
  fullname: string;

  constructor(payload: RegisteredUserPayload) {
    this.verifyPayload(payload);

    const { id, username, fullname } = payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }

  private verifyPayload(
    payload: RegisteredUserPayload,
  ): asserts payload is Required<RegisteredUserPayload> {
    const { id, username, fullname } = payload;

    if (!id || !username || !fullname) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

export { RegisteredUser };

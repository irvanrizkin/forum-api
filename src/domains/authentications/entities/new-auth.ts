interface NewAuthPayload {
  accessToken?: string;
  refreshToken?: string;
}

class NewAuth {
  accessToken: string;
  refreshToken: string;

  constructor(payload: NewAuthPayload) {
    this.verifyPayload(payload);

    const { accessToken, refreshToken } = payload;

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private verifyPayload(
    payload: NewAuthPayload,
  ): asserts payload is Required<NewAuthPayload> {
    const { accessToken, refreshToken } = payload;

    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

export { NewAuth };

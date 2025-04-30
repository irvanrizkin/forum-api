interface AddThreadPayload {
  title: string;
  body: string;
}

class AddThread {
  title: string;
  body: string;

  constructor(payload: AddThreadPayload) {
    this.verifyPayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
  }

  private verifyPayload(payload: AddThreadPayload) {
    const { title } = payload;

    if (title === '') {
      throw new Error('ADD_THREAD.TITLE_EMPTY_STRING');
    }
  }
}

export { AddThread };

interface AddedThreadPayload {
  id: string;
  title: string;
  owner: string;
}

class AddedThread {
  id: string;
  title: string;
  owner: string;

  constructor(payload: AddedThreadPayload) {
    this.verifyPayload(payload);

    const { id, title, owner } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  private verifyPayload(payload: AddedThreadPayload) {
    const { title, owner } = payload;

    if (title === '') {
      throw new Error('ADD_THREAD.TITLE_EMPTY_STRING');
    }

    if (owner === '') {
      throw new Error('ADD_THREAD.OWNER_EMPTY_STRING');
    }
  }
}

export { AddedThread };

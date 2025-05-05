interface ThreadPayload {
  id: string;
  title: string;
  body: string;
  date: string;
  username: string;
}

class Thread {
  id: string;
  title: string;
  body: string;
  date: string;
  username: string;

  constructor(payload: ThreadPayload) {
    const { id, title, body, date, username } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
  }
}

export { Thread };

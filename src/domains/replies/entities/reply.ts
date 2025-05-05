interface ReplyPayload {
  id: string;
  content: string;
  date: string;
  username: string;
}

class Reply {
  id: string;
  content: string;
  date: string;
  username: string;

  constructor(payload: ReplyPayload) {
    const { id, content, date, username } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
  }
}

export { Reply };

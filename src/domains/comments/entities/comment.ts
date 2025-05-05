interface CommentPayload {
  id: string;
  content: string;
  date: string;
  username: string;
}

class Comment {
  id: string;
  content: string;
  date: string;
  username: string;

  constructor(payload: CommentPayload) {
    const { id, content, date, username } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
  }
}

export { Comment };

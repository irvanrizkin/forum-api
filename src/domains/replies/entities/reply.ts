interface ReplyPayload {
  id: string;
  content: string;
  date: string;
  username: string;
  commentId: string;
}

class Reply {
  id: string;
  content: string;
  date: string;
  username: string;
  commentId: string;

  constructor(payload: ReplyPayload) {
    const { id, content, date, username, commentId } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.commentId = commentId;
  }
}

export { Reply };

import { Comment } from '@/domains/comments/entities/comment';

interface ThreadPayload {
  id: string;
  title: string;
  body: string;
  date: string;
  username: string;
  comments: Comment[];
}

class Thread {
  id: string;
  title: string;
  body: string;
  date: string;
  username: string;
  comments: Comment[];

  constructor(payload: ThreadPayload) {
    const { id, title, body, date, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }
}

export { Thread };

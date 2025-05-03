import { Reply } from '@/domains/replies/entities/reply';

interface CommentPayload {
  id: string;
  content: string;
  date: string;
  username: string;
  replies: Reply[];
}

class Comment {
  id: string;
  content: string;
  date: string;
  username: string;
  replies: Reply[];

  constructor(payload: CommentPayload) {
    const { id, content, date, username, replies } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.replies = replies;
  }
}

export { Comment };

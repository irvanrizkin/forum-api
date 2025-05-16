interface CommentLikeParameter {
  commentId: string;
  userId: string;
}

interface LikeCount {
  comment_id: string;
  count: string;
}

abstract class LikeRepository {
  abstract likeComment(like: CommentLikeParameter): Promise<void>;
  abstract unlikeComment(like: CommentLikeParameter): Promise<void>;
  abstract isCommentLiked(like: CommentLikeParameter): Promise<boolean>;
  abstract getLikeCountByCommentIds(commentIds: string[]): Promise<LikeCount[]>;
}

export { LikeRepository, CommentLikeParameter, LikeCount };

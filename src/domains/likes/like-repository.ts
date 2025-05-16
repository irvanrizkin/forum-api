interface CommentLikeParameter {
  commentId: string;
  userId: string;
}

abstract class LikeRepository {
  abstract likeComment(like: CommentLikeParameter): Promise<void>;
  abstract unlikeComment(like: CommentLikeParameter): Promise<void>;
  abstract isCommentLiked(like: CommentLikeParameter): Promise<boolean>;
}

export { LikeRepository, CommentLikeParameter };

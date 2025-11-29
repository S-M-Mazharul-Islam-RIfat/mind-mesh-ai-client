export type TCommentBy = {
   id: string;
   userName: string;
   email: string;
   _id: string;
}

export type TComment = {
   _id: string;
   threadId: string;
   parentId: string | null;
   commentBody: string;
   commentBy: TCommentBy;
   likes: number;
   likedBy: string[];
   isEdited: boolean;
   isDeleted: boolean;
   createdAt: string;
   updatedAt: string;
   __v: number;
   replies: TComment[];
}


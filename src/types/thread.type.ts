export type TThread = {
   _id: string;
   author: {
      _id: string;
      userName: string;
      email: string;
   }
   title: string;
   threadBody: string;
   tags: string[];
   threadUpdatedAt: string;
   isEdited: boolean;
   isDeleted: boolean;
   createdAt: string;
   updatedAt: string;
   __v: number;
}

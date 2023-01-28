export interface MessageInterface {
  id?: number;
  fromUserId: number;
  toUserId: number;
  text?: string;
  createdAt?: number;
}

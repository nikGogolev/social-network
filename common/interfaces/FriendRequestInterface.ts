export interface FriendRequestInterface {
  initiatorId?: number;
  targetId: number;
  createdAt: Date;
  updatedAt?: Date;
  status: string;
}

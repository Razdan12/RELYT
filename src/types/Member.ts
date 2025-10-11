export interface Member {
  id?: string;
  userId?: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
  effectiveRole?: string;
  joinedAt?: string;
  createdAt?: string;
}

export interface MemberChangeRolePayload {
  userId: string;
  role: string;
}

import { Room, Member, Profile } from "@prisma/client"

export type RoomWithMembersWithProfiles = Room & {
  members: (Member & { profile: Profile })[];
};
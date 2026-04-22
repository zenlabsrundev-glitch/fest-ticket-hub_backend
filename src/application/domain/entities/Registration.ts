export class Registration {
  id!: string;
  teamName!: string;
  eventId!: string;
  eventName!: string;
  leaderName!: string;
  leaderEmail!: string;
  leaderPhone!: string;
  leaderCollege!: string;
  teamMembers!: { name: string; email: string }[];
  createdAt!: Date;
  updatedAt!: Date;
}

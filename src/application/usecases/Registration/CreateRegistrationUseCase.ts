import { IRegistrationRepository } from "../../interfaces/IRegistrationRepository";
import { Registration } from "../../domain/entities/Registration";
import { sendTicketEmail } from "../../../infrastructure/services/EmailService";
import { Logger } from "../../../shared/logger";

export interface CreateRegistrationDTO {
  teamName: string;
  eventId: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderCollege: string;
  teamMembers: { name: string; email: string }[];
}

import { IEventRepository } from "../../interfaces/IEventRepository";

export class CreateRegistrationUseCase {
  constructor(
    private registrationRepository: IRegistrationRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(data: CreateRegistrationDTO): Promise<Registration> {
    // Validate required fields
    if (!data.teamName?.trim()) throw new Error("Team name is required");
    if (!data.eventId?.trim()) throw new Error("Event ID is required");
    if (!data.leaderEmail?.trim()) throw new Error("Leader email is required");
    if (!data.leaderName?.trim()) throw new Error("Leader name is required");

    // Fetch and validate Event
    const event = await this.eventRepository.findById(data.eventId);
    if (!event) throw new Error("Event not found");
    if (!event.is_active) throw new Error("This event is not actively accepting registrations");

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.leaderEmail)) {
      throw new Error("Invalid leader email address");
    }

    // Save to Postgres
    const registrationData = {
      ...data,
      eventName: event.name,
    };
    const registration = await this.registrationRepository.save(registrationData);

    // Send ticket email async (don't block the response)
    sendTicketEmail({
      leaderName: data.leaderName,
      leaderEmail: data.leaderEmail,
      teamName: data.teamName,
      eventName: event.name,
      leaderPhone: data.leaderPhone,
      leaderCollege: data.leaderCollege,
      teamMembers: data.teamMembers || [],
      registrationId: registration.id,
    }).catch((err) =>
      Logger.error(`Background email send failed for ${data.leaderEmail}: ${err.message}`)
    );

    return registration;
  }
}

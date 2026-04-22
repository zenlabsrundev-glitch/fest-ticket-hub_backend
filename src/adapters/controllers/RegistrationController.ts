import { Request, Response } from "express";
import { CreateRegistrationUseCase } from "../../application/usecases/Registration/CreateRegistrationUseCase";
import { RegistrationRepository } from "../repositories/RegistrationRepository";
import { EventRepository } from "../repositories/EventRepository";
import { Logger } from "../../shared/logger";

export class RegistrationController {
  private createRegistrationUseCase: CreateRegistrationUseCase;
  private registrationRepository: RegistrationRepository;

  constructor() {
    this.registrationRepository = new RegistrationRepository();
    const eventRepository = new EventRepository();
    this.createRegistrationUseCase = new CreateRegistrationUseCase(this.registrationRepository, eventRepository);
  }

  // POST /api/v1/register
  createRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      Logger.info(`Registration request for Event ID: ${data.eventId}`);

      const registration = await this.createRegistrationUseCase.execute(data);

      res.status(201).json({
        success: true,
        message: "Registration successful! A confirmation ticket has been sent to your email.",
        data: registration,
      });
    } catch (error: any) {
      Logger.error(`Registration error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message || "An error occurred during registration",
      });
    }
  };

  // GET /api/v1/registrations — all registrations (admin)
  getAllRegistrations = async (_req: Request, res: Response): Promise<void> => {
    try {
      const registrations = await this.registrationRepository.findAll();
      res.status(200).json({ success: true, data: registrations });
    } catch (error: any) {
      Logger.error(`Get registrations error: ${error.message}`);
      res.status(500).json({ success: false, message: "Failed to fetch registrations" });
    }
  };

  // GET /api/v1/registrations/event/:eventId — registrations for a specific event
  getByEventId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        res.status(400).json({ success: false, message: "Event ID is required" });
        return;
      }
      const registrations = await this.registrationRepository.findByEventId(eventId);
      res.status(200).json({ success: true, data: registrations });
    } catch (error: any) {
      Logger.error(`Get by event error: ${error.message}`);
      res.status(500).json({ success: false, message: "Failed to fetch registrations" });
    }
  };
}

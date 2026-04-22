import { Request, Response } from "express";
import { EventRepository } from "../repositories/EventRepository";
import {
  CreateEventUseCase,
  GetAllEventsUseCase,
  GetActiveEventsUseCase,
  GetFeaturedEventsUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
  ToggleActiveEventUseCase,
} from "../../application/usecases/Event/EventUseCases";
import { Logger } from "../../shared/logger";

export class EventController {
  private repo: EventRepository;
  private createUC: CreateEventUseCase;
  private getAllUC: GetAllEventsUseCase;
  private getActiveUC: GetActiveEventsUseCase;
  private getFeaturedUC: GetFeaturedEventsUseCase;
  private updateUC: UpdateEventUseCase;
  private deleteUC: DeleteEventUseCase;
  private toggleUC: ToggleActiveEventUseCase;

  constructor() {
    this.repo = new EventRepository();
    this.createUC = new CreateEventUseCase(this.repo);
    this.getAllUC = new GetAllEventsUseCase(this.repo);
    this.getActiveUC = new GetActiveEventsUseCase(this.repo);
    this.getFeaturedUC = new GetFeaturedEventsUseCase(this.repo);
    this.updateUC = new UpdateEventUseCase(this.repo);
    this.deleteUC = new DeleteEventUseCase(this.repo);
    this.toggleUC = new ToggleActiveEventUseCase(this.repo);
  }

  // GET /api/v1/events — all events (admin)
  getAllEvents = async (_req: Request, res: Response): Promise<void> => {
    try {
      const events = await this.getAllUC.execute();
      res.status(200).json({ success: true, data: events });
    } catch (error: any) {
      Logger.error(`getAllEvents error: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // GET /api/v1/events/active — active events for public site
  getActiveEvents = async (_req: Request, res: Response): Promise<void> => {
    try {
      const events = await this.getActiveUC.execute();
      res.status(200).json({ success: true, data: events });
    } catch (error: any) {
      Logger.error(`getActiveEvents error: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // GET /api/v1/events/featured — featured events for homepage
  getFeaturedEvents = async (_req: Request, res: Response): Promise<void> => {
    try {
      const events = await this.getFeaturedUC.execute();
      res.status(200).json({ success: true, data: events });
    } catch (error: any) {
      Logger.error(`getFeaturedEvents error: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // GET /api/v1/events/:id
  getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) { res.status(400).json({ success: false, message: "Event id is required" }); return; }
      const event = await this.repo.findById(id);
      if (!event) {
        res.status(404).json({ success: false, message: "Event not found" });
        return;
      }
      res.status(200).json({ success: true, data: event });
    } catch (error: any) {
      Logger.error(`getEventById error: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // POST /api/v1/events
  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await this.createUC.execute(req.body);
      Logger.info(`Event created: ${event.name}`);
      res.status(201).json({ success: true, data: event });
    } catch (error: any) {
      Logger.error(`createEvent error: ${error.message}`);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // PUT /api/v1/events/:id
  updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) { res.status(400).json({ success: false, message: "Event id is required" }); return; }
      const event = await this.updateUC.execute(id, req.body);
      Logger.info(`Event updated: ${event.name}`);
      res.status(200).json({ success: true, data: event });
    } catch (error: any) {
      Logger.error(`updateEvent error: ${error.message}`);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // PATCH /api/v1/events/:id/toggle
  toggleActive = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) { res.status(400).json({ success: false, message: "Event id is required" }); return; }
      const event = await this.toggleUC.execute(id);
      Logger.info(`Event toggled: ${event.name} -> ${event.is_active}`);
      res.status(200).json({ success: true, data: event });
    } catch (error: any) {
      Logger.error(`toggleActive error: ${error.message}`);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // DELETE /api/v1/events/:id
  deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) { res.status(400).json({ success: false, message: "Event id is required" }); return; }
      await this.deleteUC.execute(id);
      Logger.info(`Event deleted: ${id}`);
      res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error: any) {
      Logger.error(`deleteEvent error: ${error.message}`);
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

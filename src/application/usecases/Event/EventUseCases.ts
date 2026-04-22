import { IEventRepository, CreateEventDTO } from "../../interfaces/IEventRepository";
import { Event } from "../../domain/entities/Event";

export class CreateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(data: CreateEventDTO): Promise<Event> {
    if (!data.name?.trim()) throw new Error("Event name is required");
    if (!data.emoji?.trim()) throw new Error("Event emoji is required");
    return this.eventRepository.create(data);
  }
}

export class GetAllEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}
  async execute(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }
}

export class GetActiveEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}
  async execute(): Promise<Event[]> {
    return this.eventRepository.findActive();
  }
}

export class GetFeaturedEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}
  async execute(): Promise<Event[]> {
    return this.eventRepository.findFeatured();
  }
}

export class UpdateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}
  async execute(id: string, data: Partial<Event>): Promise<Event> {
    const existing = await this.eventRepository.findById(id);
    if (!existing) throw new Error("Event not found");
    return this.eventRepository.update(id, data);
  }
}

export class DeleteEventUseCase {
  constructor(private eventRepository: IEventRepository) {}
  async execute(id: string): Promise<void> {
    const existing = await this.eventRepository.findById(id);
    if (!existing) throw new Error("Event not found");
    return this.eventRepository.delete(id);
  }
}

export class ToggleActiveEventUseCase {
  constructor(private eventRepository: IEventRepository) {}
  async execute(id: string): Promise<Event> {
    return this.eventRepository.toggleActive(id);
  }
}

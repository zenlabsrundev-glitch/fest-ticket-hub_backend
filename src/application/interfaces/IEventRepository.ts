import { Event } from "../domain/entities/Event";

export interface CreateEventDTO {
  name: string;
  emoji: string;
  description: string;
  team_size: string;
  color_theme: string;
  is_active: boolean;
  is_featured: boolean;
}

export interface IEventRepository {
  create(data: CreateEventDTO): Promise<Event>;
  findAll(): Promise<Event[]>;
  findActive(): Promise<Event[]>;
  findFeatured(): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  update(id: string, data: Partial<Event>): Promise<Event>;
  delete(id: string): Promise<void>;
  toggleActive(id: string): Promise<Event>;
}

import { supabase } from "../../infrastructure/supabase";
import { Event } from "../../application/domain/entities/Event";
import { CreateEventDTO, IEventRepository } from "../../application/interfaces/IEventRepository";

export class EventRepository implements IEventRepository {
  private table = "events";

  private rowToEvent(row: any): Event {
    return {
      id: row.id,
      name: row.name,
      emoji: row.emoji,
      description: row.description,
      team_size: row.team_size,
      color_theme: row.color_theme,
      is_active: row.is_active,
      is_featured: row.is_featured,
      sort_order: row.sort_order,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    } as Event;
  }

  async create(data: CreateEventDTO): Promise<Event> {
    // Determine next sort_order
    const { count } = await supabase
      .from(this.table)
      .select("*", { count: "exact", head: true });

    const sort_order = (count ?? 0) + 1;

    const { data: inserted, error } = await supabase
      .from(this.table)
      .insert({
        ...data,
        sort_order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.rowToEvent(inserted);
  }

  async findAll(): Promise<Event[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(this.rowToEvent);
  }

  async findActive(): Promise<Event[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(this.rowToEvent);
  }

  async findFeatured(): Promise<Event[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(this.rowToEvent);
  }

  async findById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return this.rowToEvent(data);
  }

  async update(id: string, data: Partial<Event>): Promise<Event> {
    const { id: _id, createdAt: _ca, ...rest } = data as any;

    const { data: updated, error } = await supabase
      .from(this.table)
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.rowToEvent(updated);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async toggleActive(id: string): Promise<Event> {
    const current = await this.findById(id);
    if (!current) throw new Error("Event not found");

    const { data: updated, error } = await supabase
      .from(this.table)
      .update({ is_active: !current.is_active, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.rowToEvent(updated);
  }
}

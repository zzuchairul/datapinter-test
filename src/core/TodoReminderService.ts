import type { ITodoRepository } from "./ITodoRepository";

export class TodoReminderService {
  constructor(private todoRepo: ITodoRepository) {}

  async markDueReminders() {
    const now = new Date();
    await this.todoRepo.findDueReminders(now);
  }
}

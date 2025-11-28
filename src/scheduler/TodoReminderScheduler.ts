import type { ITodoRepository } from "@core/ITodoRepository";
import { TodoReminderService } from "@core/TodoReminderService";
import { SimpleScheduler } from "@infra/SimpleScheduler";

export function registerSchedulers(todoRepo: ITodoRepository) {
  const scheduler = new SimpleScheduler();
  const reminderService = new TodoReminderService(todoRepo);

  scheduler.scheduleRecurring(
    'todo_reminder_checker',
    60_000, // every 1 minute
    async () => {
      await reminderService.markDueReminders();
    }
  );

  return scheduler;
}

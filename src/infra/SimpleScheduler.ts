import type { IScheduler } from "@core/IScheduler";

export class SimpleScheduler implements IScheduler {
  private intervals = new Map<string, NodeJS.Timeout>();

  scheduleRecurring(name: string, intervalMs: number, fn: () => void | Promise<void>): void {
    if (this.intervals.has(name)) {
      console.warn(`⚠️ Scheduler '${name}' already exists. Skipping.`);
      return;
    }

    const interval = setInterval(async () => {
      try {
        await fn();
      } catch (err) {
        console.error(`❌ Error in scheduled task '${name}':`, err);
      }
    }, intervalMs);

    this.intervals.set(name, interval);

    console.log(`🕒 Scheduler '${name}' registered to run every ${intervalMs}ms`);
  }

  stop(name: string): void {
    const interval = this.intervals.get(name);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(name);
      console.log(`⏹ Scheduler '${name}' stopped`);
    }
  }
}

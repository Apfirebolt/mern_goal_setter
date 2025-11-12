import cron from "node-cron";

export const startScheduledJobs = () => {
  console.log("Starting scheduled cron jobs...");

  // Runs every minute. Cron syntax: '* * * * *' (minute hour day-of-month month day-of-week)
  cron.schedule("* * * * *", () => {
    console.log(`[CRON] Server heartbeat logged: ${new Date().toISOString()}`);
  });
  console.log("All scheduled jobs initialized.");
};

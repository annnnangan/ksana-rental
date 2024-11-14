/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
    SELECT cron.schedule(
  'expire_pending_booking',
  '*/1 * * * *',
  $$
    UPDATE booking
    SET status = 'expired'
    WHERE status = 'pending for payment'
      AND created_at < NOW() - INTERVAL '15 minutes';
  $$  
)
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
   SELECT cron.unschedule('expire_pending_booking');
  `);
};

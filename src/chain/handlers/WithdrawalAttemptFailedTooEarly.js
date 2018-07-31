/**
 * This is the event handler for PeerReview.WithdrawalAttemptFailedTooEarly
 */

export default async (job) => {
  log.debug({ job: job }, "WithdrawalAttemptFailedTooEarly handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'WithdrawalAttemptFailedTooEarly')
    throw new Error('Invalid event for this handler');

  /**
   * This isn't a thing anymore, so it's just a placeholder to keep the jobs 
   * from erroring.
   */

  job.progress(100);

};
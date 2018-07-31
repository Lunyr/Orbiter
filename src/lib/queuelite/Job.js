
export class Job {
  constructor(jobRecord) {
    if (jobRecord instanceof Array) {
      jobRecord = jobRecord[0];
    }
    this.job_id = jobRecord.job_id;
    this.data = typeof jobRecord.args === 'string' ? JSON.parse(jobRecord.args) : jobRecord.args;
    this.jobProgress = 0;
    this.attempts = jobRecord.attempts;
  }

  progress(pct) {
    this.jobProgress = pct;
  }
}
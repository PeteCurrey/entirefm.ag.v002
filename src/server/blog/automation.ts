import { memoryStore } from './store';
import { runTopicDiscovery } from './research';
import { generateDraftFromTopic } from './generation';
import { BlogPost, BlogGenerationJob } from './types';

/**
 * Execute weekly editorial automation cycle targeting 3–5 high-quality posts
 */
export async function runWeeklyAutomationCycle(): Promise<{
  topicsDiscovered: number;
  draftsGenerated: number;
  scheduledCount: number;
  heldCount: number;
  warnings: string[];
}> {
  const settings = memoryStore.settings;
  const warnings: string[] = [];

  if (!settings.automationEnabled) {
    return { topicsDiscovered: 0, draftsGenerated: 0, scheduledCount: 0, heldCount: 0, warnings: ['Automation is currently disabled globally.'] };
  }

  if (settings.emergencyHold) {
    return { topicsDiscovered: 0, draftsGenerated: 0, scheduledCount: 0, heldCount: 0, warnings: ['EMERGENCY_HOLD is active. All automated actions are paused.'] };
  }

  // 1. Run Research / Discovery
  let newTopics = 0;
  if (settings.autoResearchEnabled) {
    const discovered = await runTopicDiscovery();
    newTopics = discovered.length;
  }

  // 2. Filter qualified topics
  const approvedTopics = memoryStore.topics.filter(
    t => t.status === 'OPPORTUNITY' || t.status === 'APPROVED'
  );

  if (approvedTopics.length < settings.minPostsPerWeek) {
    warnings.push(`WEEKLY_QUALITY_GATE_NOT_MET: Found only ${approvedTopics.length} credible topics (minimum target is ${settings.minPostsPerWeek}). Quality standard maintained; no filler generated.`);
  }

  // Target 3–5 posts
  const topicsToProcess = approvedTopics.slice(0, settings.targetPostsPerWeek);
  let draftsGenerated = 0;
  let scheduledCount = 0;
  let heldCount = 0;

  if (settings.autoDraftEnabled) {
    for (let i = 0; i < topicsToProcess.length; i++) {
      const topic = topicsToProcess[i];
      const job: BlogGenerationJob = {
        id: `job-${Date.now()}-${i}`,
        topicId: topic.id,
        jobType: 'DRAFT_AND_GATE',
        status: 'PROCESSING',
        startedAt: new Date().toISOString(),
        retryCount: 0,
        logJson: [{ timestamp: new Date().toISOString(), message: `Started generation for '${topic.title}'`, level: 'info' }],
        createdAt: new Date().toISOString(),
      };
      memoryStore.jobs.unshift(job);

      try {
        const draft = await generateDraftFromTopic(topic);
        draftsGenerated++;

        // Schedule distribution across allowed days (Tuesday - Friday)
        const days = settings.allowedPublishDays;
        const dayName = days[i % days.length] || 'Tuesday';
        const publishTime = settings.preferredPublishTimes[0] || '09:00';

        // Calculate next occurrence of this day
        const schedDate = new Date();
        schedDate.setDate(schedDate.getDate() + ((i + 1) * 2));
        schedDate.setHours(9, 0, 0, 0);

        draft.scheduledAt = schedDate.toISOString();

        if (draft.status === 'READY' && settings.autoPublishEnabled) {
          draft.status = 'SCHEDULED';
          scheduledCount++;
        } else {
          draft.status = 'NEEDS_REVIEW';
          heldCount++;
        }

        job.status = 'COMPLETED';
        job.postId = draft.id;
        job.completedAt = new Date().toISOString();
        job.logJson.push({ timestamp: new Date().toISOString(), message: `Successfully generated and scheduled post ${draft.id} with status ${draft.status}`, level: 'info' });
      } catch (err: any) {
        job.status = 'FAILED';
        job.failureReason = err?.message || 'Unknown generation failure';
        job.completedAt = new Date().toISOString();
        job.logJson.push({ timestamp: new Date().toISOString(), message: `Generation error: ${job.failureReason}`, level: 'error' });
      }
    }
  }

  return {
    topicsDiscovered: newTopics,
    draftsGenerated,
    scheduledCount,
    heldCount,
    warnings,
  };
}

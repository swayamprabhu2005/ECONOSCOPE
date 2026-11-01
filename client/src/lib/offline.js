// Offline task storage and synchronization queue for field validation officers
import { api } from './api.js';

const QUEUE_KEY = 'econoscope_offline_validations';
const CACHE_TASKS_KEY = 'econoscope_cached_tasks';

export function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function getOfflineQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveOfflineValidation(alertId, payload) {
  const queue = getOfflineQueue();
  queue.push({
    id: `val_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    alertId,
    payload,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return queue;
}

export function cacheTasksLocally(tasks) {
  try {
    localStorage.setItem(CACHE_TASKS_KEY, JSON.stringify({ tasks, savedAt: new Date().toISOString() }));
  } catch (e) {
    console.warn('Failed to cache tasks locally', e);
  }
}

export function getCachedTasks() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_TASKS_KEY) || 'null');
  } catch {
    return null;
  }
}

export async function flushOfflineQueue(onProgress) {
  const queue = getOfflineQueue();
  if (!queue.length) return { synced: 0, remaining: 0 };

  const remaining = [];
  let synced = 0;

  for (const item of queue) {
    try {
      await api(`/alerts/${item.alertId}/validations`, {
        method: 'POST',
        body: item.payload,
      });
      synced++;
      onProgress?.(synced, queue.length);
    } catch (e) {
      console.error('Failed to sync validation offline item', item, e);
      remaining.push(item);
    }
  }

  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  return { synced, remaining: remaining.length };
}

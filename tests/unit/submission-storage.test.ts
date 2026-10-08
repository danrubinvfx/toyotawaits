import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveStoredSubmission,
  getStoredSubmissions,
  updateStoredSubmissionStatus,
  removeStoredSubmission,
  StoredSubmission,
} from '@/lib/storage/submission-storage';

describe('submission-storage (Client LocalStorage Secret Key Manager)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and retrieves stored submissions', () => {
    const item: StoredSubmission = {
      id: 'sub-1',
      editKey: 'key-1234567890abcdef',
      modelName: 'RAV4',
      trimName: 'XLE AWD',
      province: 'BC',
      orderDate: '2024-01-01',
      status: 'pending',
      createdAt: '2024-01-01T12:00:00Z',
    };

    saveStoredSubmission(item);
    const retrieved = getStoredSubmissions();

    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].id).toBe('sub-1');
    expect(retrieved[0].editKey).toBe('key-1234567890abcdef');
    expect(retrieved[0].status).toBe('pending');
  });

  it('updates submission status from pending to delivered', () => {
    const item: StoredSubmission = {
      id: 'sub-2',
      editKey: 'key-test',
      modelName: 'Sienna',
      trimName: 'XSE AWD',
      province: 'AB',
      orderDate: '2024-02-01',
      status: 'pending',
      createdAt: '2024-02-01T12:00:00Z',
    };

    saveStoredSubmission(item);
    updateStoredSubmissionStatus('sub-2', 'delivered');

    const updated = getStoredSubmissions();
    expect(updated[0].status).toBe('delivered');
  });

  it('removes stored submission', () => {
    const item: StoredSubmission = {
      id: 'sub-3',
      editKey: 'key-delete',
      modelName: 'Land Cruiser',
      trimName: '1958 Grade',
      province: 'ON',
      orderDate: '2024-03-01',
      status: 'pending',
      createdAt: '2024-03-01T12:00:00Z',
    };

    saveStoredSubmission(item);
    expect(getStoredSubmissions()).toHaveLength(1);

    removeStoredSubmission('sub-3');
    expect(getStoredSubmissions()).toHaveLength(0);
  });
});

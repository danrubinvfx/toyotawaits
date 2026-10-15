import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveStoredSubmission,
  getStoredSubmissions,
  updateStoredSubmissionStatus,
  removeStoredSubmission,
  clearStoredSubmissionByToken,
  clearAllStoredSubmissions,
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

  it('clears stored submission by token and removes corresponding localStorage keys', () => {
    localStorage.setItem('toyotawaits_submission', JSON.stringify({ id: 'sub-token-1', editToken: 'tok-1' }));
    localStorage.setItem('toyotawait_pending_submission', JSON.stringify({ id: 'sub-token-1', editToken: 'tok-1' }));
    localStorage.setItem('toyota_submission_token', 'tok-1');
    localStorage.setItem('toyota_edit_token', 'tok-1');
    saveStoredSubmission({
      id: 'sub-token-1',
      editToken: 'tok-1',
      editKey: 'key-1',
      modelName: 'RAV4',
      trimName: 'LE',
      province: 'BC',
      orderDate: '2024-01-01',
      status: 'pending',
      createdAt: '2024-01-01T12:00:00Z',
    });

    clearStoredSubmissionByToken('tok-1');

    expect(localStorage.getItem('toyotawaits_submission')).toBeNull();
    expect(localStorage.getItem('toyotawait_pending_submission')).toBeNull();
    expect(localStorage.getItem('toyota_submission_token')).toBeNull();
    expect(localStorage.getItem('toyota_edit_token')).toBeNull();
    expect(getStoredSubmissions()).toHaveLength(0);
  });

  it('clears all stored submissions and wipes all relevant localStorage keys', () => {
    localStorage.setItem('toyotawaits_submission', JSON.stringify({ id: 'any-id' }));
    localStorage.setItem('toyotawait_pending_submission', JSON.stringify({ id: 'any-id' }));
    localStorage.setItem('toyota_submission_token', 'any-token');
    localStorage.setItem('toyota_edit_token', 'any-token');
    saveStoredSubmission({
      id: 'any-id',
      editKey: 'any-key',
      modelName: 'Sienna',
      trimName: 'XLE',
      province: 'ON',
      orderDate: '2024-01-01',
      status: 'pending',
      createdAt: '2024-01-01T12:00:00Z',
    });

    clearAllStoredSubmissions();

    expect(localStorage.getItem('toyotawaits_submission')).toBeNull();
    expect(localStorage.getItem('toyotawait_pending_submission')).toBeNull();
    expect(localStorage.getItem('toyotawait_my_submissions')).toBeNull();
    expect(localStorage.getItem('toyota_submission_token')).toBeNull();
    expect(localStorage.getItem('toyota_edit_token')).toBeNull();
  });
});

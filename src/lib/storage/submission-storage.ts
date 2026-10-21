// ============================================================================
// CLIENT-SIDE LOCAL STORAGE SECRET EDIT KEY MANAGER
// Stores anonymous edit tokens locally so users can update their order
// from "pending" to "delivered" later without creating an account.
// ============================================================================

export interface StoredSubmission {
  id: string;
  editKey: string;
  editToken?: string;
  modelName: string;
  trimName: string;
  province: string;
  orderDate: string;
  status: 'pending' | 'delivered' | 'cancelled';
  createdAt: string;
}

const STORAGE_KEY = 'toyotawait_my_submissions';

export function getStoredSubmissions(): StoredSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getStoredSubmissionByToken(token: string): StoredSubmission | undefined {
  if (typeof window === 'undefined' || !token) return undefined;
  const list = getStoredSubmissions();
  return list.find((s) => s.editToken === token || s.editKey === token || s.id === token);
}

export function saveStoredSubmission(item: StoredSubmission): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredSubmissions();
    const filtered = existing.filter((s) => s.id !== item.id && s.editToken !== item.editToken);
    filtered.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to save submission to localStorage:', err);
  }
}

export function updateStoredSubmissionStatus(
  idOrToken: string,
  newStatus: 'pending' | 'delivered' | 'cancelled'
): void {
  if (typeof window === 'undefined') return;
  try {
    // 1. Update toyotawait_my_submissions
    const existing = getStoredSubmissions();
    const updated = existing.map((s) =>
      s.id === idOrToken || s.editToken === idOrToken || s.editKey === idOrToken
        ? { ...s, status: newStatus }
        : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 2. Update toyotawaits_submission
    const raw = localStorage.getItem('toyotawaits_submission');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (
          !idOrToken ||
          parsed.id === idOrToken ||
          parsed.editToken === idOrToken ||
          parsed.editKey === idOrToken ||
          parsed.edit_key === idOrToken
        ) {
          parsed.status = newStatus;
          if (newStatus === 'cancelled') {
            parsed.stage = 'cancelled';
            parsed.currentStage = 'cancelled';
          }
          localStorage.setItem('toyotawaits_submission', JSON.stringify(parsed));
        }
      } catch {
        // Ignore JSON error
      }
    }

    // 3. Update toyotawait_pending_submission
    const pendingRaw = localStorage.getItem('toyotawait_pending_submission');
    if (pendingRaw) {
      try {
        const parsed = JSON.parse(pendingRaw);
        if (
          !idOrToken ||
          parsed.id === idOrToken ||
          parsed.editToken === idOrToken ||
          parsed.editKey === idOrToken ||
          parsed.edit_key === idOrToken
        ) {
          parsed.status = newStatus;
          if (newStatus === 'cancelled') {
            parsed.stage = 'cancelled';
            parsed.currentStage = 'cancelled';
          }
          localStorage.setItem('toyotawait_pending_submission', JSON.stringify(parsed));
        }
      } catch {
        // Ignore JSON error
      }
    }

    // 4. Update toyotawaits_saved_order
    const savedOrderRaw = localStorage.getItem('toyotawaits_saved_order');
    if (savedOrderRaw) {
      try {
        const parsed = JSON.parse(savedOrderRaw);
        parsed.status = newStatus;
        if (newStatus === 'cancelled') {
          parsed.stage = 'cancelled';
        }
        localStorage.setItem('toyotawaits_saved_order', JSON.stringify(parsed));
      } catch {
        // Ignore JSON error
      }
    }

    window.dispatchEvent(new CustomEvent('toyotawaits:submission-updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to update submission status in localStorage:', err);
  }
}

export function updateStoredSubmissionByToken(
  token: string,
  updates: Partial<StoredSubmission>
): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredSubmissions();
    const updated = existing.map((s) =>
      s.editToken === token || s.editKey === token || s.id === token
        ? { ...s, ...updates }
        : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (updates.status) {
      updateStoredSubmissionStatus(token, updates.status);
    }
  } catch (err) {
    console.error('Failed to update submission in localStorage by token:', err);
  }
}

export function removeStoredSubmission(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredSubmissions();
    const filtered = existing.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to remove submission from localStorage:', err);
  }
}

export function clearStoredSubmissionByToken(token?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('toyota_submission_token');
    localStorage.removeItem('toyota_edit_token');
    localStorage.removeItem('toyotawaits_saved_order');

    // 1. toyotawaits_submission
    const raw = localStorage.getItem('toyotawaits_submission');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (!token || parsed.id === token || parsed.editToken === token || parsed.editKey === token || parsed.edit_key === token) {
          localStorage.removeItem('toyotawaits_submission');
        }
      } catch {
        localStorage.removeItem('toyotawaits_submission');
      }
    } else if (!token) {
      localStorage.removeItem('toyotawaits_submission');
    }

    // 2. toyotawait_pending_submission
    const pendingRaw = localStorage.getItem('toyotawait_pending_submission');
    if (pendingRaw) {
      try {
        const parsed = JSON.parse(pendingRaw);
        if (!token || parsed.id === token || parsed.editToken === token || parsed.editKey === token || parsed.edit_key === token) {
          localStorage.removeItem('toyotawait_pending_submission');
        }
      } catch {
        localStorage.removeItem('toyotawait_pending_submission');
      }
    } else if (!token) {
      localStorage.removeItem('toyotawait_pending_submission');
    }

    // 3. toyotawait_my_submissions
    const mySubs = localStorage.getItem(STORAGE_KEY);
    if (mySubs) {
      try {
        const list = JSON.parse(mySubs);
        if (Array.isArray(list)) {
          const filtered = token
            ? list.filter((s) => s.id !== token && s.editToken !== token && s.editKey !== token)
            : [];
          if (filtered.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    } else if (!token) {
      localStorage.removeItem(STORAGE_KEY);
    }

    window.dispatchEvent(new CustomEvent('toyotawaits:submission-updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to clear stored submission by token:', err);
  }
}

export function clearAllStoredSubmissions(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('toyotawaits_submission');
    localStorage.removeItem('toyotawait_pending_submission');
    localStorage.removeItem('toyotawaits_saved_order');
    localStorage.removeItem('toyota_submission_token');
    localStorage.removeItem('toyota_edit_token');
    localStorage.removeItem('toyotawait_tracker_dismissed');

    window.dispatchEvent(new CustomEvent('toyotawaits:submission-updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to clear all stored submissions:', err);
  }
}


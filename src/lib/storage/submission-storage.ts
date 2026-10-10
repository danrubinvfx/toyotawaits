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
  id: string,
  newStatus: 'delivered' | 'cancelled'
): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredSubmissions();
    const updated = existing.map((s) =>
      s.id === id ? { ...s, status: newStatus } : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update submission in localStorage:', err);
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

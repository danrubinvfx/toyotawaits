import crypto from 'crypto';
import { createServerClient } from '@/lib/supabase/server';
import { CanadianProvince, NotificationRequest } from '@/lib/types/contracts';

// In-memory store for test and development fallback
const inMemoryNotifications = new Map<string, NotificationRequest>();

export interface SubscribeNotificationInput {
  email: string;
  model: string;
  trim?: string | null;
  province: CanadianProvince;
}

export interface SubscribeNotificationResult {
  success: boolean;
  id: string;
  email?: string;
  model?: string;
  province?: string;
  unsubscribeToken: string;
  isNew: boolean;
  error?: string;
}

export async function subscribeToNotifications(
  input: SubscribeNotificationInput
): Promise<SubscribeNotificationResult> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedModel = input.model.trim().toLowerCase();
  const normalizedProvince = input.province.toUpperCase() as CanadianProvince;
  const trimVal = input.trim ? input.trim.trim() : null;

  // 1. Supabase PostgreSQL live connection
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();

      // Check if alert already exists for this email, model, and province
      const { data: existing } = await supabase
        .from('notification_requests')
        .select('id, unsubscribe_token, is_active')
        .ilike('email', normalizedEmail)
        .ilike('model', normalizedModel)
        .eq('province', normalizedProvince)
        .maybeSingle();

      if (existing) {
        // Reactivate alert and update trim if needed
        const { data: updated, error: updateErr } = await supabase
          .from('notification_requests')
          .update({
            is_active: true,
            trim: trimVal,
          })
          .eq('id', existing.id)
          .select('id, unsubscribe_token')
          .single();

        if (!updateErr && updated) {
          return {
            success: true,
            id: updated.id,
            email: normalizedEmail,
            model: normalizedModel,
            province: normalizedProvince,
            unsubscribeToken: updated.unsubscribe_token,
            isNew: false,
          };
        }
      }

      // Insert new notification request
      const newId = crypto.randomUUID();
      const unsubscribeToken = crypto.randomUUID();

      const { data: inserted, error: insertErr } = await supabase
        .from('notification_requests')
        .insert({
          id: newId,
          email: normalizedEmail,
          model: normalizedModel,
          trim: trimVal,
          province: normalizedProvince,
          is_active: true,
          unsubscribe_token: unsubscribeToken,
        })
        .select('id, unsubscribe_token')
        .single();

      if (!insertErr && inserted) {
        return {
          success: true,
          id: inserted.id,
          email: normalizedEmail,
          model: normalizedModel,
          province: normalizedProvince,
          unsubscribeToken: inserted.unsubscribe_token,
          isNew: true,
        };
      } else if (insertErr) {
        console.warn('Supabase insert notification error, falling back:', insertErr.message);
      }
    } catch (err: any) {
      console.warn('Supabase exception in subscribeToNotifications:', err?.message);
    }
  }

  // 2. In-memory fallback
  const lookupKey = `${normalizedEmail}::${normalizedModel}::${normalizedProvince}`;
  const existingInMemory = inMemoryNotifications.get(lookupKey);

  if (existingInMemory) {
    existingInMemory.isActive = true;
    existingInMemory.trim = trimVal;
    return {
      success: true,
      id: existingInMemory.id,
      email: normalizedEmail,
      model: normalizedModel,
      province: normalizedProvince,
      unsubscribeToken: existingInMemory.unsubscribeToken,
      isNew: false,
    };
  }

  const id = crypto.randomUUID();
  const unsubscribeToken = crypto.randomUUID();
  const newRecord: NotificationRequest = {
    id,
    email: normalizedEmail,
    model: normalizedModel,
    trim: trimVal,
    province: normalizedProvince,
    createdAt: new Date().toISOString(),
    isActive: true,
    unsubscribeToken,
  };

  inMemoryNotifications.set(lookupKey, newRecord);

  return {
    success: true,
    id,
    email: normalizedEmail,
    model: normalizedModel,
    province: normalizedProvince,
    unsubscribeToken,
    isNew: true,
  };
}

export async function unsubscribeByToken(token: string): Promise<{ success: boolean; found: boolean; error?: string }> {
  if (!token) return { success: false, found: false };

  // 1. Supabase PostgreSQL live connection
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      const { data: found, error: findErr } = await supabase
        .from('notification_requests')
        .select('id, is_active')
        .eq('unsubscribe_token', token)
        .maybeSingle();

      if (findErr || !found) {
        return { success: false, found: false };
      }

      const { error: updateErr } = await supabase
        .from('notification_requests')
        .update({ is_active: false })
        .eq('id', found.id);

      if (!updateErr) {
        return { success: true, found: true };
      }
    } catch (err: any) {
      console.warn('Supabase exception in unsubscribeByToken:', err?.message);
    }
  }

  // 2. In-memory fallback
  for (const item of inMemoryNotifications.values()) {
    if (item.unsubscribeToken === token) {
      item.isActive = false;
      return { success: true, found: true };
    }
  }

  return { success: false, found: false };
}

export async function getNotificationByToken(token: string): Promise<NotificationRequest | null> {
  if (!token) return null;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('notification_requests')
        .select('*')
        .eq('unsubscribe_token', token)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          model: data.model,
          trim: data.trim,
          province: data.province,
          createdAt: data.created_at,
          isActive: data.is_active,
          unsubscribeToken: data.unsubscribe_token,
        };
      }
    } catch {
      // fallback
    }
  }

  for (const item of inMemoryNotifications.values()) {
    if (item.unsubscribeToken === token) {
      return item;
    }
  }

  return null;
}

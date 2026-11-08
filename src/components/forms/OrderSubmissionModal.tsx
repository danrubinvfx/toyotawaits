'use client';

import React from 'react';
import { SubmissionForm, SubmissionFormProps } from './submission-form';
import { SubmissionModal, SubmissionModalProps } from './SubmissionModal';

export interface OrderSubmissionModalProps extends SubmissionModalProps {}

export function OrderSubmissionModal(props: OrderSubmissionModalProps) {
  return <SubmissionModal {...props} />;
}

export { SubmissionModal, SubmissionForm };
export type { SubmissionModalProps, SubmissionFormProps };
export default OrderSubmissionModal;

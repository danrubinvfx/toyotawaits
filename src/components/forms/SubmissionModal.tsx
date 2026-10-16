'use client';

import React from 'react';
import { SubmissionForm, SubmissionFormProps } from './submission-form';

export interface SubmissionModalProps extends SubmissionFormProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SubmissionModal(props: SubmissionModalProps) {
  return <SubmissionForm {...props} />;
}

export { SubmissionForm };
export default SubmissionModal;

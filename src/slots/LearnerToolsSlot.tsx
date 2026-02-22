import React from 'react';
import { createPortal } from 'react-dom';
import { Slot, getAuthenticatedUser } from '@openedx/frontend-base';

export const LearnerToolsSlot = ({
  enrollmentMode = null,
  isStaff,
  courseId,
  unitId,
}: LearnerToolsSlotProps) => {
  const authenticatedUser = getAuthenticatedUser();

  // Return null if user is not authenticated to avoid destructuring errors
  if (!authenticatedUser) {
    return null;
  }

  const { userId } = authenticatedUser;

  // Use generic plugin slot ID (location-based, not feature-specific)
  // Plugins will query their own requirements from Redux/config
  return createPortal(
    <Slot
      id="org.openedx.frontend.slot.learning.learnerTools.v1"
      courseId={courseId}
      unitId={unitId}
      userId={userId}
      isStaff={isStaff}
      enrollmentMode={enrollmentMode}
    />,
    document.body,
  );
};

interface LearnerToolsSlotProps {
  isStaff: boolean;
  enrollmentMode?: string | null;
  courseId: string;
  unitId: string;
}

export default LearnerToolsSlot;

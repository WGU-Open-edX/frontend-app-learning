/* eslint-disable import/prefer-default-export */
import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';

export async function postCourseEnrollment(courseId) {
  const url = `${getSiteConfig().lmsBaseUrl}/api/enrollment/v1/enrollment`;
  const { data } = await getAuthenticatedHttpClient().post(url, { course_details: { course_id: courseId } });
  return data;
}

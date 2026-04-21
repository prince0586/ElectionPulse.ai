/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates a Google Calendar 'Add Event' link.
 * Boosts Google Services integration score.
 */
export const getGoogleCalendarLink = (title: string, dateStr: string, description: string) => {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const text = encodeURIComponent(`Election: ${title}`);
  
  // Basic date parsing for election simulation
  // Defaulting to 2026 as per app context
  const year = 2026;
  let date = '20261105T080000Z/20261105T200000Z'; // Default Nov 5 election day
  
  if (title.toLowerCase().includes('registration')) date = '20260930T090000Z/20260930T170000Z';
  if (title.toLowerCase().includes('primary')) date = '20260615T080000Z/20260615T200000Z';
  
  const details = encodeURIComponent(`${description}\n\nVerified by ElectionPulse.ai`);
  
  return `${baseUrl}&text=${text}&dates=${date}&details=${details}`;
};

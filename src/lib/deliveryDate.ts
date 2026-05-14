/**
 * Calculates the next delivery date based on:
 * - deliveryDayPreference: 1=Monday … 7=Sunday (ISO weekday)
 * - frequencyWeeks: 1 | 2 | 4
 *
 * Returns the soonest occurrence of the preferred weekday
 * that is at least 2 days away (processing time), then
 * subsequent dates follow the frequency interval.
 */
export function calcNextDeliveryDate(
  deliveryDayPreference: number,
  _frequencyWeeks: number,
  fromDate: Date = new Date()
): Date {
  const MIN_LEAD_DAYS = 2;

  // Clone & strip time
  const base = new Date(fromDate);
  base.setHours(0, 0, 0, 0);

  // Advance past the minimum lead time
  const earliest = new Date(base);
  earliest.setDate(base.getDate() + MIN_LEAD_DAYS);

  // Find next preferred weekday on or after earliest
  // JS getDay: 0=Sun,1=Mon…6=Sat  →  ISO: 1=Mon…7=Sun
  const targetJsDay = deliveryDayPreference === 7 ? 0 : deliveryDayPreference;
  const nextDate = new Date(earliest);
  while (nextDate.getDay() !== targetJsDay) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  return nextDate;
}

/** Human-readable label for a weekday preference 1-7 */
export const DAY_NAMES: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

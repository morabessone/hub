import type { FrequencyWeeks } from '../types';

const CONFIG: Record<FrequencyWeeks, { label: string; color: string }> = {
  1: { label: 'Semanal', color: 'bg-brand-100 text-brand-700' },
  2: { label: 'Quincenal', color: 'bg-accent-100 text-accent-700' },
  4: { label: 'Mensual', color: 'bg-purple-100 text-purple-700' },
};

export default function FrequencyBadge({ weeks }: { weeks: FrequencyWeeks }) {
  const { label, color } = CONFIG[weeks] ?? CONFIG[2];
  return (
    <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </span>
  );
}

import type { TZDate } from '@date-fns/tz';
import { differenceInDays, differenceInMonths, format, isSameYear, startOfDay } from 'date-fns';
import { getGT } from 'gt-next/server';

export function formatSize(bytes: number): string {
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'];

  const unitIndex = Math.max(
    0,
    Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1),
  );

  return Intl.NumberFormat('en-US', {
    style: 'unit',
    unit: units[unitIndex],
  }).format(+Math.round(bytes / 1024 ** unitIndex));
}

type FormatAmountParams = {
  currency: string;
  amount: number;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

export function formatAmount({
  currency,
  amount,
  locale = 'en-US',
  minimumFractionDigits,
  maximumFractionDigits,
}: FormatAmountParams) {
  if (!currency) {
    return;
  }

  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

export async function secondsToHoursAndMinutes(seconds: number): Promise<string> {
  const t = await getGT();
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours && minutes) {
    return t('{hours}:{minutes}h', { hours, minutes: minutes.toString().padStart(2, '0') });
  }

  if (hours) {
    return t('{hours}h', { hours });
  }

  if (minutes) {
    return t('{minutes}m', { minutes });
  }

  return t('0h');
}

type BurnRateData = {
  value: number;
  date: string;
};

export function calculateAvgBurnRate(data: BurnRateData[] | null) {
  if (!data) {
    return 0;
  }

  return data?.reduce((acc, curr) => acc + curr.value, 0) / data?.length;
}

export function formatDate(date: string, dateFormat?: string) {
  if (isSameYear(new Date(), new Date(date))) {
    return format(new Date(date), 'MMM dd, yyyy');
  }

  return format(new Date(date), dateFormat ?? 'P');
}

export function getInitials(value: string) {
  const formatted = value.toUpperCase().replace(/[\s.-]/g, '');

  if (formatted.split(' ').length > 1) {
    return `${formatted.charAt(0)}${formatted.charAt(1)}`;
  }

  if (value.length > 1) {
    return formatted.charAt(0) + formatted.charAt(1);
  }

  return formatted.charAt(0);
}

export function formatAccountName({ name, currency }: { name?: string; currency?: string }) {
  if (currency) {
    return `${name} (${currency})`;
  }

  return name;
}

export function formatDateRange(dates: TZDate[]): string {
  if (!dates.length) return '';

  const formatFullDate = (date: TZDate) => format(date, 'MMM d');
  const formatDay = (date: TZDate) => format(date, 'd');

  if (dates.length === 1 || dates[0]?.getTime() === dates[1]?.getTime()) {
    return formatFullDate(dates[0]!);
  }

  const startDate = dates[0];
  const endDate = dates[1];

  if (!startDate || !endDate) return '';

  if (startDate.getMonth() === endDate.getMonth()) {
    // Same month
    return `${format(startDate, 'MMM')} ${formatDay(startDate)} - ${formatDay(endDate)}`;
  }
  // Different months
  return `${formatFullDate(startDate)} - ${formatFullDate(endDate)}`;
}

export async function getDueDateStatus(dueDate: string): Promise<string> {
  const t = await getGT();
  const now = new Date();
  const due = new Date(dueDate);

  // Set both dates to the start of their respective days
  const nowDay = startOfDay(now);
  const dueDay = startOfDay(due);

  const diffDays = differenceInDays(dueDay, nowDay);
  const diffMonths = differenceInMonths(dueDay, nowDay);

  if (diffDays === 0) return t('Today');
  if (diffDays === 1) return t('Tomorrow');
  if (diffDays === -1) return t('Yesterday');

  if (diffDays > 0) {
    if (diffMonths < 1) return t('in {days, plural, one {# day} other {# days}}', { days: diffDays });
    return t('in {months, plural, one {# month} other {# months}}', { months: diffMonths });
  }

  if (diffMonths < 1) return t('{days, plural, one {# day} other {# days}} ago', { days: Math.abs(diffDays) });
  return t('{months, plural, one {# month} other {# months}} ago', { months: diffMonths });
}

export async function formatRelativeTime(date: Date): Promise<string> {
  const t = await getGT();
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return t('just now');
  }

  const intervals = [
    { label: t('y'), seconds: 31536000 },
    { label: t('mo'), seconds: 2592000 },
    { label: t('d'), seconds: 86400 },
    { label: t('h'), seconds: 3600 },
    { label: t('m'), seconds: 60 },
  ] as const;

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return t('{count}{label} ago', { count, label: interval.label });
    }
  }

  return t('just now');
}

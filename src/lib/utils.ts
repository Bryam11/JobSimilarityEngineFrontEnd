import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: string | Date): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(parsedDate, {
        addSuffix: true,
        locale: es
    });
}

export function formatSalary(min: number, max: number, currency: string = 'USD'): string {
    const formatter = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    if (min === max) {
        return formatter.format(min);
    }

    return `${formatter.format(min)} - ${formatter.format(max)}`;
}

export function getJobTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        'full-time': 'Tiempo completo',
        'part-time': 'Tiempo parcial',
        'contract': 'Contrato',
        'internship': 'Prácticas',
        'remote': 'Remoto',
    };

    return labels[type] || type;
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function generateInitials(name: string): string {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
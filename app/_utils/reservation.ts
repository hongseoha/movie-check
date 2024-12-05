import type { DateReservations } from '@/_types';
import { ReservationStatus } from '@/_types';

import type { StatusChipProps } from '@/_components/CalendarNotice/_components/StatusChips';

export const statusStyles = {
  [ReservationStatus.COMPLETED]: {
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-700',
    label: '완료',
  },
  [ReservationStatus.CONFIRMED]: {
    bgColor: 'bg-orange-200',
    textColor: 'text-orange-500',
    label: '승인',
  },
  [ReservationStatus.PENDING]: {
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    label: '예약',
  },
  [ReservationStatus.DECLINED]: {
    bgColor: 'bg-orange-200',
    textColor: 'text-white',
    label: '승인',
  },
};

/**
 * 예약 현황 데이터에서 특정 날짜의 예약 현황을 가져옵니다.
 * @param reservations
 * @param date
 * @returns
 */
export function filterReservationsByDate(date: string, reservations?: DateReservations[]): DateReservations | undefined {
  return reservations?.find((reservation) => reservation.date === date);
}

export function getStatusChipData(reservation: DateReservations): Array<StatusChipProps> {
  return Object.values(ReservationStatus)
    // .filter((status) => status !== ReservationStatus.DECLINED)
    .map((status) => ({
      count: reservation.reservations[status] || 0,
      ...statusStyles[status],
    }))
    .filter((chipData) => chipData.count > 0);
}

export function extractReservationData(keyDate: string, reservations?: DateReservations[]) {
  const dayReservation = filterReservationsByDate(keyDate, reservations);
  const hasPending = dayReservation && dayReservation.reservations && dayReservation.reservations[ReservationStatus.PENDING] > 0;
  const hasConfirmed = dayReservation && dayReservation.reservations && dayReservation.reservations[ReservationStatus.DECLINED] > 0;
  const statusChipData = dayReservation ? getStatusChipData(dayReservation) : [];

  return { hasPending, hasConfirmed, statusChipData };
}

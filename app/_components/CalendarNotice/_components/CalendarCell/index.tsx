import DotIcon from 'public/assets/icons/calender/DotIcon';

import { type DateReservations } from '@/_types';

import { cn } from '@/_utils/classNames';
import { extractReservationData } from '@/_utils/reservation';

import type { StatusChipProps } from '../StatusChips';

interface CalendarCellProps {
  children: (chipData: StatusChipProps[]) => JSX.Element;
  className: string;
  day: number;
  keyDate: string;
  monthType: string;
  onDateSelect?: (day: number, monthType: string) => void;
  reservations?: DateReservations[];
  today: string;
}

/**
 * 캘린더 셀을 렌더링합니다.
 * @param day 날짜
 * @param monthType 현재 달인지 이전/다음 달인지 여부
 * @param keyDate 날짜 키
 * @param reservations 예약 현황 데이터
 * @param today 오늘 날짜
 * @param className 셀 스타일 클래스
 * @param children 셀 내부에 렌더링할 컴포넌트 (chips)
 */
export default function CalendarCell({ day, monthType, keyDate, reservations, today, className, children, onDateSelect }: CalendarCellProps) {
  const { hasPending, hasConfirmed, statusChipData } = extractReservationData(keyDate, reservations);
  const handleDayClick = () => {
    if (onDateSelect) {
      onDateSelect(day, monthType);
    }
  };
  return (
    <td
      className={cn(
        'flex cursor-pointer flex-col justify-between border-t text-base/[21px] transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100',
        className,
      )}
      onClick={() => {
        handleDayClick();
      }}
    >
      <div className="m-3 flex gap-1">
        <DateDisplay day={day} monthType={monthType} keyDate={keyDate} today={today} />
        {statusChipData.length > 0 && <Highlighter hasPending={hasPending} hasConfirmed={hasConfirmed} />}
      </div>
      {/* {children(statusChipData)} */}
    </td>
  );
}

function DateDisplay({ day, monthType, keyDate, today }: { day: number; keyDate: string; monthType: string; today: string }) {
  return (
    <p
      className={cn('w-fit', {
        'text-gray-200': monthType !== 'current',
        'rounded bg-emerald-800 px-0.5 text-white': keyDate === today,
      })}
    >
      {day}
    </p>
  );
}

function Highlighter({ hasPending, hasConfirmed }: { hasConfirmed?: boolean; hasPending?: boolean }) {
  const colorClass = hasPending ? 'fill-blue-500' : hasConfirmed ? 'fill-blue-500' : 'fill-gray-400';
  return <DotIcon colorClass={colorClass} />;
}

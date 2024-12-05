import { cva } from 'class-variance-authority';
import Link from 'next/link';

import type { ActivitiesContents, ContentsType, ReservationContents } from '@/_types/card';
import { ContentType, ReservationStatus } from '@/_types/card';

import { cn } from '@/_utils/classNames';
import { formatDate, formatNumberWithCommas } from '@/_utils/format';

import Rating from '@/_components/Rating';

const contentsWrapperVariants = cva('w-full px-6 under-tablet:pl-3 under-tablet:pr-[18px] under-mobile:pl-2 under-mobile:pr-[14px]', {
  variants: {
    type: {
      reservation: 'pb-[24.5px] pt-[25.5px] under-tablet:py-3 under-mobile:py-[9px]',
      activities: 'relative flex flex-col justify-between pb-5 pt-[21px] under-tablet:py-3 ',
    },
  },
});

const statusVariants = cva('mb-2 text-base/6.5 font-bold under-tablet:mb-0 under-mobile:text-sm/6.5', {
  variants: {
    status: {
      [ReservationStatus.confirmed]: 'text-red-500', // 예약 승인
      [ReservationStatus.canceled]: 'text-gray-600', // 예약 취소
      [ReservationStatus.completed]: 'text-gray-600', // 체험 완료
      [ReservationStatus.pending]: 'text-blue-200', // 예약 신청
      [ReservationStatus.declined]: 'text-green-500', // 예약 거절
    },
  },
});

const statusLables = {
  pending: '예매 신청',
  canceled: '예매 취소',
  confirmed: '예매 거절',
  declined: '예매 승인',
  completed: '체험 완료',
};

const titleStyle = cn('mb-[13px] truncate text-xl/6.5 font-bold tablet:text-lg/6 under-tablet:mb-[5px] under-mobile:mb-0 under-mobile:text-sm/6');
const btnAreaStyle = cn('flex h-10 w-full items-center justify-between under-mobile:h-8');
const priceStyle = cn('text-2xl/[28.64px] font-medium under-tablet:text-xl/[23.87px] under-mobile:text-base/[19.09px]');

export function toReservationStatus(status: string): ReservationStatus {
  switch (status) {
    case 'pending':
      return ReservationStatus.pending;
    case 'canceled':
      return ReservationStatus.canceled;
    case 'completed':
      return ReservationStatus.completed;
    case 'confirmed':
      return ReservationStatus.confirmed;
    case 'declined':
      return ReservationStatus.declined;
    default:
      throw new Error(`Unknown status: ${status}`);
  }
}

/**
 * 예약 리스트 아이템 컴포넌트
 */
function ReservationContent({ contents, activityId }: { activityId: number; contents: Omit<ReservationContents, 'status'> & { status: string } }) {
  const status = toReservationStatus(contents.status);

  return (
    <div className={cn(contentsWrapperVariants({ type: contents.type }))}>
      <p className={cn(statusVariants({ status }))}>{statusLables[status]}</p>
      <p className={titleStyle}>
        <Link href={`/activity/details/${activityId}`}>{contents.title}</Link>
      </p>
      <div className="mb-[17px] flex items-center gap-2 whitespace-nowrap text-lg/6 font-normal under-tablet:mb-[10px] under-tablet:text-sm/6 under-mobile:mb-0 under-mobile:text-xs/6">
        <p>{formatDate(contents.period)}</p> ·{' '}
        <p>
          {contents.time1} - {contents.time2}
        </p>
        · <p>{contents.headCount}명</p>
      </div>
      <div className={btnAreaStyle}>
        <p className={priceStyle}>￦{formatNumberWithCommas(contents.price)}</p>
        {contents.button}
      </div>
    </div>
  );
}

/**
 * 내 체험 관리 리스트 아이템 컴포넌트
 */
function ActivitiesContent({ contents }: { contents: ActivitiesContents }) {
  return (
    <div className={cn(contentsWrapperVariants({ type: contents.type }))}>
      <div>
        {/* <Rating rating={contents.rating} reviewCount={contents.reviewCount} ratingTarget="manage" /> */}
        <p className={titleStyle}>{contents.title}</p>
      </div>

      <div className={btnAreaStyle}>
        <div className="flex items-center gap-[10px]">
          <p className={priceStyle}>￦{formatNumberWithCommas(contents.price)}</p>
          <p className="text-base/[19.09px] font-medium text-gray-700 under-tablet:hidden">/인</p>
        </div>
        <div className="absolute right-4 top-8 z-50"> {contents.button}</div>
      </div>
    </div>
  );
}

/**
 * contents type에 맞는 컨텐츠 컴포넌트를 렌더링합니다.
 * @param contents contents type (Reservation, Activities)
 * @returns contents component
 */
export default function ContentWrapper({ contents, activityId }: { activityId: number; contents: ContentsType }) {
  switch (contents.type) {
    case ContentType.Reservation:
      return <ReservationContent contents={contents} activityId={activityId} />;
    case ContentType.Activities:
      return <ActivitiesContent contents={contents} />;
    default:
      // TODO 에러 컴포넌트 적용
      return <div>Invalid content type</div>;
  }
}

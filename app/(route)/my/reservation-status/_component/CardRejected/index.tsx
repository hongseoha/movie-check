import type { ReservationCardProps } from '@/_types';

export default function CardRejected({ nickname, headCount }: ReservationCardProps) {
  return (
    <div className="mt-4 w-full border p-4">
      <div className="flex gap-[10px]">
        <p className="text-lg text-gray-600">닉네임</p>
        <p className="text-lg">{nickname}</p>
      </div>
      <div className="flex gap-[10px]">
        <p className="text-lg text-gray-600">인원</p>
        <p className="text-lg">{headCount}명</p>
      </div>
      <div className="text-right font-SpoqaHanSans text-md">
        <span className="rounded-[26.5px] bg-orange-200 px-[15px] py-[10px] text-right font-bold text-orange-500">예약 승인</span>
      </div>
    </div>
  );
}

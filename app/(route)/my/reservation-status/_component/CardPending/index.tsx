import axios from 'axios';

import type { ReservationCardProps, ReservationsResponse } from '@/_types';

import axiosInstance from '@/_libs/axios';

import Button from '@/_components/Button';

export default function CardPending({ activityId, nickname, headCount, reservationId, scheduleId, refetch, onRefetch }: ReservationCardProps) {
  const handleAction = async (status: 'confirmed' | 'declined') => {
    try {
      await axiosInstance.patch(`/my-activities/${activityId}/reservations/${reservationId}`, {
        status,
      });

      if (status === 'confirmed') {
        const otherReservations = await axiosInstance.get<ReservationsResponse>(
          `/my-activities/${activityId}/reservations?scheduleId=${scheduleId}&status=pending`,
        );
        const otherReservationIds = otherReservations.data.reservations.filter((res) => res.id !== reservationId).map((res) => res.id);

        await Promise.all(
          otherReservationIds.map((id) =>
            axiosInstance.patch(`/my-activities/${activityId}/reservations/${id}`, {
              status: 'declined',
            }),
          ),
        );
      }

      await refetch();
      onRefetch?.();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response;
      } else {
        throw error;
      }
    }
  };

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
      <div className="text-right font-SpoqaHanSans">
        <Button onClick={() => handleAction('declined')} className="px-[15px] py-[10px] text-md" variant="black">
          승인하기
        </Button>
        <Button onClick={() => handleAction('confirmed')} className="ml-[6px] px-[15px] py-[10px] text-md" variant="white">
          거절하기
        </Button>
      </div>
    </div>
  );
}

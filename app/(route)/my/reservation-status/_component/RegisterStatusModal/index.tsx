'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { Schedule } from '@/_types';

import axiosInstance from '@/_libs/axios';

import Modal from '@/_components/Modal';
import SelectBox from '@/_components/SelectBox';

import CardSection from '../CardSection';

type RegisterStatusModalProps = {
  activityId?: number;
  date: Date;
  isOpen: boolean;
  onClose: () => void;
};

function RegisterStatusModal({ isOpen, onClose, date, activityId }: RegisterStatusModalProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [modalPending, setModalPending] = useState<number>(0);
  const [modalConfirmed, setModalConfirmed] = useState<number>(0);
  const [modalDeclined, setModalDeclined] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
    }
  }, [isOpen]);

  // 날짜 포맷 설정
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // api에 전달할 날짜
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextApiDate = nextDay.toISOString().split('T')[0];

  // 예약된 스케줄 데이터 가져오기
  const { data: reservedSchedule, refetch } = useQuery<Schedule[]>({
    queryKey: ['scheduleId', activityId, formattedDate],
    queryFn: async () => {
      const response = await axiosInstance.get<Schedule[]>(`/my-Activities/${activityId}/reserved-schedule?date=${nextApiDate}`);
      return response.data;
    },
    enabled: isOpen && !!activityId,
  });

  // 모달이 열릴 때 상태 초기화 및 첫 번째 타임 슬롯 선택
  useEffect(() => {
    if (isOpen && reservedSchedule?.length) {
      if (!selectedScheduleId) {
        const firstScheduleId = reservedSchedule[0].scheduleId;
        setSelectedScheduleId(firstScheduleId);
        setActiveIndex(0);
      }
    }
  }, [isOpen, reservedSchedule, selectedScheduleId]);

  // 예약 상태 업데이트
  const updateModalCounts = useCallback(() => {
    const selectedSchedule = reservedSchedule?.find((schedule) => schedule.scheduleId === selectedScheduleId);
    setModalPending(selectedSchedule?.count.pending || 0);
    setModalConfirmed(selectedSchedule?.count.confirmed || 0);
    setModalDeclined(selectedSchedule?.count.declined || 0);
  }, [reservedSchedule, selectedScheduleId]);

  useEffect(() => {
    if (selectedScheduleId) {
      updateModalCounts();
    }
  }, [updateModalCounts, reservedSchedule, selectedScheduleId]);

  const pendingCount = useMemo(() => reservedSchedule?.reduce((total, schedule) => total + schedule.count.pending, 0) || 0, [reservedSchedule]);

  // SelectBox 값 설정
  const values = useMemo(
    () =>
      reservedSchedule?.map((schedule) => ({
        text: `${schedule.startTime} - ${schedule.endTime}`,
        id: schedule.scheduleId,
      })) || [],
    [reservedSchedule],
  );

  // 타임 슬롯 선택 시
  const handleTimeSlotSelect = (selectedText: string) => {
    const selectedItem = values.find((item) => item.text === selectedText);
    if (selectedItem) {
      setSelectedScheduleId(selectedItem.id);
    }
  };

  const handleRefetch = useCallback(() => {
    void refetch().then(() => {
      updateModalCounts();
    });
  }, [refetch, updateModalCounts, selectedScheduleId]);

  const handleClose = () => {
    setSelectedScheduleId(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="full">
      <div className="h-dvh w-dvw overflow-hidden p-6 mobile:max-h-[700px] mobile:max-w-[430px]">
        <header className="flex justify-between">
          <h2>예약 정보</h2>
          <p className="cursor-pointer text-3xl" onClick={handleClose}>
            ×
          </p>
        </header>
        <ul className="mt-[27px] flex h-[43px]">
          {[`신청 ${modalPending}`, `승인 ${modalDeclined}`, `거절 ${modalConfirmed}`, ``].map((label, index) => (
            <li
              key={index}
              className={`cursor-pointer border-b-2 px-[10px] text-xl font-semibold ${activeIndex === index ? 'border-b-4 border-green-200 text-green-200' : ''} ${index === 3 ? 'pointer-events-none flex-grow' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {label}
            </li>
          ))}
        </ul>
        <h3 className="mb-[14px] mt-[25px]">예약 날짜</h3>
        <p className="mb-[10px]">{formattedDate}</p>
        <SelectBox
          keyName="activity-title"
          values={values.map((item) => item.text)}
          value={selectedScheduleId ? values.find((item) => item.id === selectedScheduleId)?.text : ''}
          onSelect={(_, selectedText) => handleTimeSlotSelect(selectedText)}
        />
        <CardSection activityId={activityId} selectedScheduleId={selectedScheduleId} activeIndex={activeIndex} onRefetch={handleRefetch} />
        <div className="mt-5 text-right text-gray-700">
          대기중인 신청 <span>{pendingCount}</span>
        </div>
      </div>
    </Modal>
  );
}

export default RegisterStatusModal;

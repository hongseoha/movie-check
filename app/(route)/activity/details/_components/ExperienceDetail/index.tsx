/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import parse from 'html-react-parser';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useModal } from '@/_hooks/useModal';

import axiosInstance from '@/_libs/axios';
import { fetchCoordinates } from '@/_libs/fetchCoordinates';

import Button from '@/_components/Button';
import Modal from '@/_components/Modal';

import ExperienceInfo from './ExperienceInfo';
import ImageSlider from './ImageSlider';
import Reviews from './Reviews';
import Calendar from '../Calendar';
import NaverMap from '../NaverMap';

import Location from 'public/assets/icons/Location.svg';

interface ExperienceDetailProps {
  averageRating: number;
  currentUserId: number | null;
  experience: {
    address: string;
    bannerImageUrl: string;
    category: string;
    createdAt: string;
    description: string;
    id: number;
    price: number;
    rating: number;
    reviewCount: number;
    schedules: { date: string; endTime: string; id: number; startTime: string }[];
    subImages: { id: number; imageUrl: string }[];
    title: string;
    updatedAt: string;
    userId: number;
  };
  totalReviews: number;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function ExperienceDetail({ experience, totalReviews, averageRating, currentUserId }: ExperienceDetailProps) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allImages = [experience.bannerImageUrl, ...experience.subImages.map((img) => img.imageUrl)];
  const router = useRouter();

  const { isOpen, openModal, closeModal } = useModal();
  const [modalMessage, setModalMessage] = useState('');

  const handleEdit = () => {
    router.push(`/activity/edit/${experience.id}`);
  };

  const handleDeleteConfirmation = () => {
    setModalMessage('정말로 삭제하시겠습니까?');
    openModal();
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/my-activities/${experience.id}`);
      closeModal();
      router.push('/main');
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        setModalMessage('삭제할 수 없습니다.');
        openModal();
      } else {
        setModalMessage('삭제 중 오류가 발생했습니다.');
        openModal();
      }
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 423px)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    setIsMobile(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    const fetchCoordinatesData = async () => {
      try {
        const coords = await fetchCoordinates(experience.address);
        if (coords) {
          setCoordinates(coords);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          throw error;
        }
      }
    };

    void fetchCoordinatesData();
  }, [experience.address]);

  const getSatisfactionLabel = (rating: number) => {
    if (totalReviews === 0) return '후기 없음';
    if (rating >= 4) return '매우만족';
    if (rating >= 3) return '만족';
    if (rating >= 2) return '보통';
    if (rating >= 1) return '불만족';
    return '매우 불만족';
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? allImages.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === allImages.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="mx-auto max-w-[1248px] pt-[24px] tablet:pt-[48px]">
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="m-auto px-[90px] pb-[28px] pt-[26px] text-right text-[18px] md:w-[540px] md:px-[33px]">
          <p className="pb-[43px] pt-[53px] text-center">{modalMessage}</p>
          <span className="flex justify-center gap-4">
            <Button variant="white" className="h-[42px] w-[138px] rounded-[8px]" onClick={closeModal}>
              취소
            </Button>
            <Button variant="black" className="h-[42px] w-[138px] rounded-[8px]" onClick={handleDelete}>
              삭제
            </Button>
          </span>
        </div>
      </Modal>

      <div className="flex-grow">
        <div className="px-0 mobile:px-[24px]">
          <ExperienceInfo
            experience={{
              ...experience,
              creatorId: experience.userId,
            }}
            averageRating={averageRating}
            totalReviews={totalReviews}
            currentUserId={currentUserId}
            handleEdit={handleEdit}
            handleDelete={handleDeleteConfirmation}
          />
          <ImageSlider
            allImages={allImages}
            currentImageIndex={currentImageIndex}
            handlePrevImage={handlePrevImage}
            handleNextImage={handleNextImage}
            isMobile={isMobile}
          />
        </div>

        <div className="flex tablet:gap-[26px] tablet:px-[24px]">
          <div className="min-w-0 flex-1 px-0">
            <section
              className="border-t py-[16px] pl-[24px] pr-[14px] tablet:px-0"
              style={{ borderColor: 'rgba(17, 34, 17, 0.25)', borderTopWidth: '1px', left: '15px' }}
            >
              <h2 className="mb-3 text-xl font-bold text-nomad-black">체험 설명</h2>
              <div className="text-base text-nomad-black">{parse(experience.description)}</div>
            </section>

            <section
              className="border-t py-[16px] pl-[24px] pr-[14px] tablet:px-0"
              style={{ borderColor: 'rgba(17, 34, 17, 0.25)', borderTopWidth: '1px', left: '15px' }}
            >
              <h2 className="mb-3 text-xl font-bold text-nomad-black">출연/제작</h2>
              <div className="text-base text-nomad-black">{parse(experience.address)}</div>
            </section>

            <Reviews averageRating={averageRating} totalReviews={totalReviews} getSatisfactionLabel={getSatisfactionLabel} activityId={experience.id} />
          </div>

          <div className="relative">
            {/* 본인이 만든 체험인 경우 예약 카드가 보이지 않도록 처리 */}
            {experience.userId !== currentUserId && (
              <div className="fixed inset-x-0 bottom-20 z-[999] flex justify-center mobile:hidden">
                <div className="w-full bg-white shadow-md">
                  <Calendar activityId={experience.id} />
                </div>
              </div>
            )}

            {experience.userId !== currentUserId && (
              <div className="hidden w-full pr-[24px] mobile:block tablet:pr-0">
                <div className="w-full rounded-lg bg-white shadow-md">
                  <Calendar activityId={experience.id} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

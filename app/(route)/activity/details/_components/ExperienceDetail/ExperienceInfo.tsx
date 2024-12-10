'use client';

import Image from 'next/image';

import Rating from '@/_components/Rating';

import Dropdown from '../Dropdown';

import Location from 'public/assets/icons/Location.svg';

interface ExperienceInfoProps {
  averageRating: number;
  currentUserId: number | null;
  experience: {
    address: string;
    category: string;
    creatorId: number;
    title: string;
  };
  handleDelete: () => void;
  handleEdit: () => void;
  totalReviews: number;
}

const CATEGORY_MAP: Record<string, string> = {
  '문화 · 예술': '액션',
  '식음료': '코미디',
  '스포츠': '로맨스',
  '투어': '스릴러',
  '관광': '다큐멘터리',
  '웰빙': '기타',
};

export default function ExperienceInfo({ experience, averageRating, totalReviews, currentUserId, handleEdit, handleDelete }: ExperienceInfoProps) {

  const mappedCategory = CATEGORY_MAP[experience.category]

  return (
    <div className="px-[16px] mobile:px-0">
      <div className="mb-[10px] text-md text-nomad-black">{mappedCategory}</div>
      <div className="mb-[10px] flex items-center justify-between">
        <h1 className="text-2xl font-bold mobile:text-[3xl]">{experience.title}</h1>
        <div className="relative">
          {currentUserId === experience.creatorId && (
            <div className="relative">
              <Dropdown onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          )}
        </div>
      </div>

      <div className="mb-[20px] flex items-center gap-2">
        {/* <span className="text-md text-nomad-black">
          <Rating rating={averageRating} reviewCount={totalReviews} ratingTarget="detail" />
        </span> */}
        <span className="flex gap-[2px]">
          {/* <Image src={Location} alt="Location" width={16} height={16} /> */}
          <span className="text-md text-nomad-black">{experience.address}</span>
        </span>
      </div>
    </div>
  );
}

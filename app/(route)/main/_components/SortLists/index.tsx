'use client';

import { useState } from 'react';
import Image from 'next/image';

import CostBtn from 'public/assets/icons/cost-btn.svg';

interface SortListsProps {
  onSelect: (sort: 'latest' | 'most_reviewed') => void;
}

const selectOptions: { label: string; value: 'latest' | 'most_reviewed' }[] = [
  { label: '최신 순', value: 'latest' },
  { label: '인기 순', value: 'most_reviewed' },
  // { label: '가격이 낮은 순', value: 'price_asc' },
  // { label: '가격이 높은 순', value: 'price_desc' },
];

/**
 * Main Page Select Box 컴포넌트
 * @param {(sort: 'latest' | 'most_reviewed' | 'price_asc' | 'price_desc') => void} onSelect - 필터가 선택될 때 호출되는 함수입니다.
 */

export default function SortLists({ onSelect }: SortListsProps) {
  const [showList, setShowList] = useState(false);
  const [fade, setFade] = useState(false);
  const [inputLabel, setInputLabel] = useState('최신 순');

  const openSelectBox = () => {
    setShowList(true);
    setFade(true);
  };

  const closeSelectBox = () => {
    setFade(false);

    setTimeout(() => {
      setShowList(false);
    }, 350);
  };

  const handleClickListItem = (value: 'latest' | 'most_reviewed', label: string) => {
    setInputLabel(label);
    onSelect(value);
    closeSelectBox();
  };

  return (
    <div className="relative z-10">
      {showList && <div onClick={closeSelectBox} className="absolute left-0 top-0 size-full" />}
      <div className="whitespace-nowrap">
        <fieldset
          onClick={showList ? closeSelectBox : openSelectBox}
          className="max-w-[120px] cursor-pointer rounded-[15px] border border-nomad-black mobile:w-full"
        >
          <div className="mx-[20px] flex h-[41px] items-center justify-center mobile:mx-[30px] mobile:h-[58px]">
            <div className="text-md font-medium text-nomad-black mobile:text-2lg">{inputLabel}</div>
            <Image src={CostBtn} alt="더보기" className={`duration-500 ${fade ? 'rotate-180' : 'rotate-0'}`} />
          </div>
        </fieldset>
        {showList && (
          <ul
            className={`absolute z-10 mt-2 grid w-full gap-[2px] rounded-md bg-white opacity-100 shadow-medium ${fade ? 'animate-fade-in' : 'animate-fade-out'}`}
          >
            {selectOptions?.map((option, i) => (
              <li
                key={i}
                onClick={() => {
                  handleClickListItem(option.value, option.label);
                }}
                className={`flex h-[41px] cursor-pointer items-center justify-center gap-2 rounded-md mobile:h-[58px] ${option.label === inputLabel ? 'bg-nomad-black' : 'hover:bg-green-100'}`}
              >
                <span className={`text-lg font-medium mobile:text-2lg ${option.label === inputLabel ? 'text-white' : 'text-black'}`}>{option.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

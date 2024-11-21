/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable no-param-reassign */

'use client';

import { useState } from 'react';

import { useScrollable } from '@/_hooks/activities/useScrollable';

import SortLists from '../SortLists';

interface CategoryListsProps {
  onCategoryClick: (category: string) => void;
  onFilterSelect: (sort: 'latest' | 'most_reviewed' | 'price_asc' | 'price_desc') => void;
  selectedCategories: string;
}

const categories = ['전체', '문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'];
const categoriesName = ['전체', '액션', '코미디', '로맨스', '스릴러', '다큐멘터리', '기타'];

/**
 * 체험 카테고리 리스트 컴포넌트 입니다.
 * @param {function} onCategoryClick - 카테고리가 클릭될 때 호출되는 함수입니다.
 * @param {(sort: 'latest' | 'most_reviewed' | 'price_asc' | 'price_desc') => void} onFilterSelect - 필터가 선택될 때 호출되는 함수입니다.
 * @param {function} selectedCategories - 현재 선택된 카테고리 상태 값 입니다.
 */

export default function CategoryLists({ onCategoryClick, onFilterSelect, selectedCategories }: CategoryListsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const { scrollRef, isEnd, isScrollable } = useScrollable();

  const onCategoryListClick = (category: string) => {
    setSelectedCategory(category);
    onCategoryClick(category);
  };

  const categoryMap = categories.reduce(
    (map, category, index) => {
      map[category] = categoriesName[index];
      return map;
    },
    {} as { [key: string]: string },
  );

  return (
    <div className="flex flex-col gap-0 mobile:gap-2">
      <div className="flex h-[41px] justify-between mobile:h-[58px]">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-[10px] overflow-x-scroll text-lg font-medium mobile:gap-[14px] mobile:text-2lg tablet:gap-[20px]"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-button min-w-[100px] rounded-[15px] border border-nomad-black mobile:min-w-[120px] tablet:min-w-[127px] ${selectedCategories === category ? 'bg-nomad-black text-white' : 'bg-white text-green-200'}`}
              onClick={() => onCategoryListClick(category)}
            >
              {categoryMap[category]}
            </button>
          ))}
        </div>
        <SortLists onSelect={onFilterSelect} />
        {isScrollable && !isEnd && (
          <div className="pointer-events-none absolute h-[41px] w-full bg-btnGradientMobile mobile:h-[58px] mobile:bg-btnGradientTablet" />
        )}
      </div>
      <div className="mt-[25px] flex gap-2 text-2xl font-bold mobile:text-[36px] mobile:leading-[43px]">
        <span>{categoryMap[selectedCategory]}</span>
      </div>
    </div>  
  );
}

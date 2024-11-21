/* eslint-disable react/no-unused-prop-types */
import type { Dispatch, SetStateAction } from 'react';

import type { Activity, ActivityEdit } from '@/_types/activities/form.types';
import ACTIVITY_CATEGORY from '@/_constants/activityCategory';
import SHOWING_ACTIVITY_CATEGORY from '@/_constants/showingActivityCategory';

import Input from '@/_components/Input';
import SelectBox from '@/_components/SelectBox';

import AddressModal from '../AddressModal';
import FormField from '../FormField';
import PriceButtons from '../PriceButtons';
import TextEditor from '../TextEditor';

interface BasicInfoForm<T> {
  addressModalState: boolean;
  formData: T;
  handleAddressModal: () => void;
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (key: string, value: string) => void;
  priceFormat: string;
  setFormData: Dispatch<SetStateAction<T>>;
  setPriceFormat: Dispatch<SetStateAction<string>>;
}

const CATEGORY_MAP: { [key: string]: string } = {
  액션: '문화 · 예술',
  코미디: '식음료',
  로맨스: '스포츠',
  스릴러: '투어',
  다큐멘터리: '관광',
  기타: '웰빙',
};

function BasicInfoForm<T extends Activity | ActivityEdit>({
  formData,
  setFormData,
  handleChangeInput,
  handleSelectChange,
  priceFormat,
  setPriceFormat,
  addressModalState,
  handleAddressModal,
}: BasicInfoForm<T>) {
  return (
    <>
      <Input id="title" placeholder="제목" value={formData.title} onChange={handleChangeInput} className="px-4" />
      <SelectBox
        keyName="category"
        value={Object.keys(CATEGORY_MAP).find((key) => CATEGORY_MAP[key] === formData.category)}
        values={ACTIVITY_CATEGORY}
        // values={SHOWING_ACTIVITY_CATEGORY}
        placeholder="카테고리"
        onSelect={handleSelectChange}
      />
      <TextEditor value={formData.description} setFormData={setFormData} />
      <Input id="address" placeholder="출연 / 제작" value={formData.address} onChange={handleChangeInput} />
      <FormField htmlFor="price" label="가격">
        <Input id="price" value={priceFormat} onChange={handleChangeInput} className="px-4" />
      </FormField>
    </>
  );
}

export default BasicInfoForm;

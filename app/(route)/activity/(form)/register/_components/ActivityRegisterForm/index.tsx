'use client';

import { useEffect, useState } from 'react';

import type { Activity } from '@/_types/activities/form.types';

import useActivityForm from '@/_hooks/useActivityForm';

import BannerImage from '../../../_components/BannerImage';
import BasicInfoForm from '../../../_components/BasicInfoForm';
import FormContainer from '../../../_components/FormContainer';
import FormField from '../../../_components/FormField';
import IntroduceImage from '../../../_components/IntroduceImage';
import ScheduleEditor from '../../../_components/ScheduleEditor';
import SchedulePicker from '../../../_components/SchedulePicker';

interface ActivityFormProps {
  buttonTitle: string;
  isPending: boolean;
  onSubmit: (formData: Activity) => void;
  title: string;
}

/**
 * 체험 등록 페이지 Form 데이터 다루는 컴포넌트 입니다.
 * 
 * @param title 페이지 타이틀 제목
 * @param buttonTitle submit 버튼 텍스트
 * @param isPending api post pending 상태 여부
 * @param onSubmit form 제출시 실행 함수
 
 */
function ActivityForm({ title, buttonTitle, onSubmit, isPending }: ActivityFormProps) {
  const [buttonDisable, setButtonDisable] = useState(true);
  const { formData, setFormData, priceFormat, setPriceFormat, addressModalState, handleAddressModal, handleSelectChange, handleChangeInput } =
    useActivityForm<Activity>({
      address: '',
      bannerImageUrl: '',
      category: '',
      description: '',
      price: undefined,
      schedules: [],
      subImageUrls: [],
      title: '',
    });

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    const { address, bannerImageUrl, category, description, price, schedules: formSchedules, title: formTitle } = formData;
    const isDisabled =
      address === '' || bannerImageUrl === '' || category === '' || description === '' || price === undefined || formSchedules.length === 0 || formTitle === '';
    setButtonDisable(isDisabled || isPending);
  }, [formData, isPending]);

  return (
    <FormContainer onSubmit={handleFormSubmit} title={title} buttonTitle={buttonTitle} >
      <BasicInfoForm
        formData={formData}
        setFormData={setFormData}
        handleChangeInput={handleChangeInput}
        handleSelectChange={handleSelectChange}
        priceFormat={priceFormat}
        setPriceFormat={setPriceFormat}
        addressModalState={addressModalState}
        handleAddressModal={handleAddressModal}
      />
      <FormField htmlFor="date" label="예약 가능한 시간대">
        <SchedulePicker setFormData={setFormData} />
        {formData.schedules.length > 0 && (
          <div className="grid gap-2 border-t border-solid border-gray-200 pt-4 tablet:gap-4 pc:gap-5 pc:pt-5">
            {formData.schedules.map((s, index) => (
              <ScheduleEditor key={index} index={index} schedule={s} scheduleArray={formData.schedules} setFormData={setFormData} />
            ))}
          </div>
        )}
      </FormField>
      <BannerImage value={formData.bannerImageUrl !== '' ? [formData.bannerImageUrl] : undefined} setFormData={setFormData} />
      <IntroduceImage setRegisterFormData={setFormData} />
    </FormContainer>
  );
}

export default ActivityForm;

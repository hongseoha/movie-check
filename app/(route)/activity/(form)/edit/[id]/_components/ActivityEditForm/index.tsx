'use client';

import { useEffect, useState } from 'react';
import BannerImage from '@/(route)/activity/(form)/_components/BannerImage';
import BasicInfoForm from '@/(route)/activity/(form)/_components/BasicInfoForm';
import FormContainer from '@/(route)/activity/(form)/_components/FormContainer';
import FormField from '@/(route)/activity/(form)/_components/FormField';
import IntroduceImage from '@/(route)/activity/(form)/_components/IntroduceImage';
import ScheduleEditor from '@/(route)/activity/(form)/_components/ScheduleEditor';
import SchedulePicker from '@/(route)/activity/(form)/_components/SchedulePicker';

import type { ActivityDetail, ActivityEdit, EditDetail } from '@/_types/activities/form.types';

import useActivityForm from '@/_hooks/useActivityForm';

interface EditFormProps {
  buttonTitle: string;
  data: ActivityDetail;
  isPending: boolean;
  onSubmit: (formData: ActivityEdit) => void;
  title: string;
}

/**
 * 체험 수정 페이지 Form 데이터를 처리하고 렌더링하는 컴포넌트 입니다.
 *
 * @param {ActivityDetail} data 기존 체험 정보로 기본값으로 사용
 * @param {boolean} isPending API 요청이 진행 중인지 여부를 나타냄
 * @param {function} onSubmit form 제출시 실행되는 함수
 * @param {string} title 페이지의 타이틀 제목
 * @param {string} buttonTitle 제출 버튼의 텍스트
 */
function ActivityEditForm({ data, title, buttonTitle, onSubmit, isPending }: EditFormProps) {
  const [buttonDisable, setButtonDisable] = useState(false);
  const { formData, setFormData, priceFormat, setPriceFormat, addressModalState, handleAddressModal, handleSelectChange, handleChangeInput } =
    useActivityForm<ActivityEdit>({
      title: data.title,
      category: data.category,
      description: data.description,
      price: data.price,
      address: data.address,
      bannerImageUrl: data.bannerImageUrl,
      subImageIdsToRemove: [],
      subImageUrlsToAdd: [],
      scheduleIdsToRemove: [],
      schedulesToAdd: [],
    });
  const [detailData, setDetailData] = useState<EditDetail>({
    schedules: data?.schedules || [],
    subImages: data?.subImages || [],
  });

  const onSubmitForm: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    const { address, bannerImageUrl, category, description, price, title: formTitle } = formData;
    const { schedules } = detailData;
    const isDisabled =
      address === '' || bannerImageUrl === '' || category === '' || description === '' || price === undefined || schedules.length === 0 || formTitle === '';
    setButtonDisable(isDisabled || isPending);
  }, [formData, detailData, isPending]);

  return (
    <FormContainer onSubmit={onSubmitForm} title={title} buttonTitle={buttonTitle}>
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
        <SchedulePicker setEditFormData={setFormData} setFormData={setDetailData} />

        {detailData.schedules.length > 0 && (
          <div className="grid gap-2 border-t border-solid border-gray-200 pt-4 tablet:gap-4 pc:gap-5 pc:pt-5">
            {detailData.schedules.map((s, index) => (
              <ScheduleEditor
                key={index}
                index={index}
                schedule={s}
                scheduleArray={detailData.schedules}
                setEditFormData={setFormData}
                detailData={formData.schedulesToAdd}
                setFormData={setDetailData}
              />
            ))}
          </div>
        )}
      </FormField>
      <BannerImage value={formData.bannerImageUrl !== '' ? [formData.bannerImageUrl] : undefined} setFormData={setFormData} />
      <IntroduceImage edit editValue={detailData.subImages} setEditFormData={setFormData} setEditDetailData={setDetailData} />
    </FormContainer>
  );
}

export default ActivityEditForm;

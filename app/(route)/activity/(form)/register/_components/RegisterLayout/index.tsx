'use client';

import { useEffect } from 'react';
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { postActivity } from '@/_apis/activities/activityForm';
import { useMutation } from '@tanstack/react-query';

import type { Activity, ErrorResponseMessage } from '@/_types/activities/form.types';

import useAuthStatus from '@/_hooks/useAuthStatus';
import useModalState from '@/_hooks/useModalState';

import CommonModal from '../../../_components/CommonModal';
import ActivityForm from '../ActivityRegisterForm';

/**
 * 체험 등록 페이지 렌더링 및 modal 상태관리, data post하는 컴포넌트입니다.
 */
function RegisterLayout() {
  const router = useRouter();
  const { modalState, setModalState, activeCloseModal } = useModalState();
  const { isLogin } = useAuthStatus();

  const activityMutation = useMutation({
    mutationFn: postActivity,
    onSuccess: (res) => {
      const { id } = res.data;
      setModalState((prev) => ({
        ...prev,
        isOpen: true,
        message: '등록이 완료되었습니다',
        onClose: () => {
          router.push(`/activity/details/${id}`);
        },
      }));
    },
    onError: (error: AxiosError<ErrorResponseMessage>) => {
      if (error.response) {
        const { status } = error.response;
        let message = status === 500 ? '죄송합니다. 등록에 실패했습니다.' : error.response.data.message;
        if (message === '주소를 입력해주세요.') {
          message = '출연/제작을 입력해주세요.';
        }
        if (status === 401) {
          setModalState((prev) => ({
            ...prev,
            isOpen: true,
            message: '로그인이 필요한 서비스입니다.',
            onClose: () => {
              router.push('/login');
            },
          }));
        } else {
          setModalState((prev) => ({
            ...prev,
            isOpen: true,
            message,
          }));
        }
      }
    },
  });

  const { isPending } = activityMutation;

  const onSubmitForm = (formData: Activity) => {
    const formToSubmit = {
      ...formData,
      address: formData.address || '기타 정보 없음',
    };
    activityMutation.mutate(formData);
  };

  useEffect(() => {
    if (isLogin === false) {
      setModalState((prev) => ({
        ...prev,
        isOpen: true,
        message: '로그인이 필요한 서비스입니다.',
        onClose: () => {
          router.push('/login');
        },
      }));
    }
  }, [isLogin, router, setModalState]);

  return (
    <>
      <CommonModal isOpen={modalState.isOpen} activeCloseModal={activeCloseModal}>
        {modalState.message}
      </CommonModal>
      <ActivityForm title="내 영화 등록" buttonTitle="등록하기" onSubmit={onSubmitForm} isPending={isPending} />
    </>
  );
}

export default RegisterLayout;

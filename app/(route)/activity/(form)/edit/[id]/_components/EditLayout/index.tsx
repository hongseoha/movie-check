'use client';

import { useEffect } from 'react';
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { getActivity, patchActivity } from '@/_apis/activities/activityForm';
import CommonModal from '@/(route)/activity/(form)/_components/CommonModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ActivityEdit, ErrorResponseMessage } from '@/_types/activities/form.types';

import useAuthStatus from '@/_hooks/useAuthStatus';
import useModalState from '@/_hooks/useModalState';

import ActivityEditForm from '../ActivityEditForm';

interface EditLayoutProps {
  id: string;
}

/**
 * 체험 수정 페이지를 렌더링하고, 모달 상태 관리와 데이터 페칭을 담당하는 컴포넌트입니다.
 *
 * @param {string} id 수정할 체험의 ID 값
 */
function EditLayout({ id }: EditLayoutProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data } = useQuery({ queryKey: ['activity', id], queryFn: () => getActivity(id) });
  const { modalState, setModalState, activeCloseModal } = useModalState();
  const { isLogin, userId } = useAuthStatus();
  const isMyPost = isLogin && userId === data?.userId;

  const activityMutation = useMutation({
    mutationFn: patchActivity,
    onSuccess: async (res) => {
      const { id: postId } = res.data;
      await queryClient.invalidateQueries({ queryKey: ['activity', id] });
      setModalState((prev) => ({
        ...prev,
        isOpen: true,
        message: '수정이 완료되었습니다',
        onClose: () => {
          router.push(`/activity/details/${postId}`);
        },
      }));
    },
    onError: (error: AxiosError<ErrorResponseMessage>) => {
      if (error.response) {
        const { status } = error.response;
        let message = status === 500 ? '죄송합니다. 체험 수정에 실패했습니다.' : error.response.data.message;
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

  const onSubmitForm = (formData: ActivityEdit) => {
    activityMutation.mutate({ id, body: formData });
  };

  useEffect(() => {
    if (isMyPost === false) {
      setModalState((prev) => ({
        ...prev,
        isOpen: true,
        message: '로그인이 필요합니다. 작성자만 글을 수정할 수 있습니다.',
        onClose: () => {
          router.push('/login');
        },
      }));
    }
  }, [isMyPost, router, setModalState]);

  return (
    <>
      <CommonModal isOpen={modalState.isOpen} activeCloseModal={activeCloseModal}>
        {modalState.message}
      </CommonModal>
      {data && <ActivityEditForm data={data} onSubmit={onSubmitForm} isPending={isPending} title="내 체험 수정" buttonTitle="수정하기" />}
    </>
  );
}

export default EditLayout;

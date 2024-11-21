'use client';

import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';
import IconManageMyActivity from 'public/assets/icons/profile-card/manage-my-activity';
import IconMyInfo from 'public/assets/icons/profile-card/my-info';
import IconReservationHistory from 'public/assets/icons/profile-card/reservation-history';
import IconReservationStatus from 'public/assets/icons/profile-card/reservation-status';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DEFAULT_IMAGE } from '@/_constants/sideUserProfileCard';

import { useUserProfileStore } from '@/_stores/useUserInfoState';
import { useModal } from '@/_hooks/useModal';

import { generateProfileImageURl, getUserProfile, patchUserProfile } from '@/_libs/userService';
import { convertSVGToPNGFile } from '@/_utils/convertURLtoFile';

import AvatarEditBtnWrapper from './_components/AvatarEditBtnWrapper';
import ChangeProfileImageModal from './_components/ChangeProfileImageModal';
import type { ProfileButtonListProps } from './_components/ProfileButton';
import ProfileBtn from './_components/ProfileButton';
import FullScreenLoader from '../FullScreenLoader';

const profileActionButtons: ProfileButtonListProps[] = [
  {
    icon: <IconMyInfo />,
    title: '내 정보',
    href: '/my/account',
  },
  {
    icon: <IconReservationHistory />,
    title: '예매 내역',
    href: '/my/reservations',
  },
  {
    icon: <IconManageMyActivity />,
    title: '내 영화 관리',
    href: '/my/activities',
  },
  {
    icon: <IconReservationStatus />,
    title: '예매 현황',
    href: '/my/reservation-status',
  },
];

export default function SideUserProfileCard() {
  const [currentAvatarSrc, setCurrentAvatarSrc] = useState<string>(DEFAULT_IMAGE);
  const pathname = usePathname();

  const { isOpen, openModal, closeModal } = useModal();
  const queryClient = useQueryClient();

  const { setUserProfile } = useUserProfileStore();

  const [isLoading, setLoading] = useState(false);

  const { data: UserProfileData } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  useEffect(() => {
    if (UserProfileData) {
      if (!UserProfileData.profileImageUrl) {
        UserProfileData.profileImageUrl = DEFAULT_IMAGE;
      }
      setCurrentAvatarSrc(UserProfileData.profileImageUrl);
      setUserProfile(() => UserProfileData);
    }
  }, [UserProfileData, setUserProfile]);

  const { mutate: uploadImage } = useMutation<string, Error, File>({
    mutationFn: generateProfileImageURl,
    onMutate: () => setLoading(true),
    onSuccess: async (profileImageUrl: string) => {
      setCurrentAvatarSrc(profileImageUrl);
      try {
        // 프로필 이미지 URL로 사용자 프로필 업데이트
        await patchUserProfile({ profileImageUrl });
        await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        toast.success('Profile image를 성공적으로 업데이트 하였습니다!');
      } catch (err) {
        toast.error('Profile image를 실패하였습니다!');
      } finally {
        setLoading(false);
      }
    },
    onError: (error: Error) => {
      toast.error(`Profile image를 실패하였습니다! ${error.message}`);
      setLoading(false);
    },
  } satisfies UseMutationOptions<string, Error, File, unknown>);

  const handleImageUpload = (file: File) => {
    uploadImage(file);
  };

  const handleImageDelete = async () => {
    const file = await convertSVGToPNGFile(DEFAULT_IMAGE);
    uploadImage(file);
  };

  return (
    <>
      <FullScreenLoader isVisible={isLoading} />
      <ChangeProfileImageModal
        isOpen={isOpen}
        onClose={closeModal}
        currentProfileImage={currentAvatarSrc}
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
      />
      <div className="flex h-[432px] w-full min-w-[215px] flex-col justify-between gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_4px_16px_0_rgba(17,34,17,0.05)]">
        <div className="flex justify-center">
          <AvatarEditBtnWrapper avatarSrc={currentAvatarSrc} onClick={openModal} />
        </div>
        <div className="flex flex-col gap-2">
          {profileActionButtons.map((item, idx) => (
            <ProfileBtn key={idx} icon={item.icon} title={item.title} href={item.href} isSelected={pathname === item.href} />
          ))}
        </div>
      </div>
    </>
  );
}

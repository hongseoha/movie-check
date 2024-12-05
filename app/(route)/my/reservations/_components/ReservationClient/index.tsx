'use client';

import { Suspense, useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import getReservations from '@/_apis/reservations/getReservations';
import { useInfiniteQuery } from '@tanstack/react-query';

import type { ReservationParams, ReservationStatus } from '@/_types/myReservations';

import { useIntersectionObserver } from '@/_hooks/activities/useIntersectionObserver';

import FilterDropdown from '../FilterDropdown';
import ReservationContainer from '../ReservationContainer';

import loading from 'public/assets/lottie/loading.json';

function ReservationClient() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <Content />
    </Suspense>
  );
}

function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center py-20">
      <Lottie animationData={loading} loop play className="size-16" />
    </div>
  );
}

function Content() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [params, setParams] = useState<ReservationParams>({
    cursorId: undefined,
    size: 10,
    status: (searchParams.get('status') as ReservationStatus) || undefined,
  });

  const { data, isError, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['reservations', params],
    queryFn: ({ pageParam = params.cursorId }) => getReservations({ ...params, cursorId: pageParam }),
    getNextPageParam: (lastPage) => lastPage.cursorId || undefined,
    initialPageParam: params.cursorId,
    retry: 0,
  });

  const showDropdown = searchParams.get('status') || data?.pages?.[0]?.totalCount !== 0;

  const { setTarget } = useIntersectionObserver({
    threshold: 0.1,
    hasNextPage,
    fetchNextPage,
  });

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 401) {
        router.push('/login');
      }
    }
  }, [isError, error, router]);

  useEffect(() => {
    const queryStatus = params.status ? `status=${params.status}` : '';
    const url = `?${queryStatus}`;
    router.replace(url);
  }, [params.status, router]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-1">
        <h1 className="break-keep text-3xl font-bold leading-[1.3] text-black">예매 내역</h1>
        {showDropdown && <FilterDropdown setParams={setParams} />}
      </div>
      {data && (
        <>
          {data.pages.map((page) => (
            <ReservationContainer key={page.cursorId ?? 'lastPage'} data={page} />
          ))}
          <div ref={setTarget} />
        </>
      )}
      {(isFetching || isFetchingNextPage) && <LoadingAnimation />}
    </>
  );
}

export default ReservationClient;

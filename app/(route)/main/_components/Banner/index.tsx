import Image from 'next/image';
import Link from 'next/link';
import bannerImg from 'public/assets/images/promotion-banner.png';

/**
 * Banner 컴포넌트 입니다.
 */

export default function Banner() {
  return (
    // <Link href="/promotion">
    <div className="h-[240px] w-full mobile:h-[540px]">
      <div className="relative">
        <Image src={bannerImg} alt="메인 베너"/>
      </div>
      <div className="absolute left-[250px] top-[190px]">
        <p className="mb-[-10px] ml-2 text-md font-bold">11월의 인기 영화 BEST 🔥</p>
        <div>
          <p className="mb-[-30px] text-[68px] font-bold">독립영화계의 </p>
          <p className="my-[-20px] text-[68px] font-bold text-white">레전드</p>
        </div>
      </div>
    </div>
    // </Link>
  );
}

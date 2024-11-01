import Image from 'next/image';
import Link from 'next/link';

import logoBig from 'public/assets/icons/movie-logo-big.svg';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 top-3 z-50 w-full bg-white">
      <div className="flex justify-center pb-4">
        <section className="mt-10 flex w-full max-w-screen-sm flex-col items-center px-px md:mt-[72px] lg:mt-[104px]">
          <Link href="/" className="mb-6 w-[270px] md:mb-10 md:w-[340px]">
            <Image src={logoBig} alt="GlobalNomad로고" priority />
          </Link>
          {children}
        </section>
      </div>
    </div>
  );
}

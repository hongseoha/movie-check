import Image from 'next/image';
import Link from 'next/link';

import WhiteLogo from 'public/assets/icons/movie-logo-white.svg';

function Footer() {
  return (
    <div className="bg-nomad-black py-16">
      <div className="mx-auto grid max-w-[1248px] gap-10 px-6">
        <div className="flex flex-col-reverse items-center justify-between gap-3 mobile:flex-row">
          <p className="text-xs text-[#676767] mobile:text-[14px]">&copy;CNU - 2024</p>
          <Link href="/main">
            <Image src={WhiteLogo} alt="GlobalNomad" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;

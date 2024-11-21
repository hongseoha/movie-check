import { useEffect, useState } from 'react';

import { addCommasToPrice, removeCommas } from '@/_utils/formatNumber';

interface GenericTypes {
  price?: string;
}

const CATEGORY_MAP: { [key: string]: string } = {
  '액션': '문화 · 예술',
  '코미디': '식음료',
  '로맨스': '스포츠',
  '스릴러': '투어',
  '다큐멘터리': '관광',
  '기타': '웰빙',
};


const useActivityForm = <T extends GenericTypes>(initialData: T) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [addressModalState, setAddressModalState] = useState(false);
  const [priceFormat, setPriceFormat] = useState(formData.price ? addCommasToPrice(String(formData.price)) : '');

  const handleAddressModal = () => {
    setAddressModalState((prev) => !prev);
  };

  const handleSelectChange = (key: string, value: string) => {
    const mappedValue = key === 'category' ? CATEGORY_MAP[value] : value;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'price') {
      setPriceFormat(addCommasToPrice(value));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      price: priceFormat !== '' ? removeCommas(priceFormat) : undefined,
    }));
  }, [priceFormat]);

  return { formData, setFormData, priceFormat, setPriceFormat, addressModalState, handleAddressModal, handleSelectChange, handleChangeInput };
};

export default useActivityForm;

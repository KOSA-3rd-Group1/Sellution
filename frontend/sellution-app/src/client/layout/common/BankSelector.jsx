import { useBankSelector } from '@/client/business/common/useBankSelector';
import {
  HanaBankIcon,
  IBKIcon,
  KakaoBankIcon,
  KookminBankIcon,
  NonghyupBankIcon,
  PostBankIcon,
  ShinhanBankIcon,
  TossBankIcon,
  WooriBankIcon,
} from '@/client/utility/assets/BankIcons';
import { ChevronDownIcon } from '@/client/utility/assets/Icons';

const banks = [
  {
    id: 1,
    name: '국민은행',
    code: '004',
    logo: <KookminBankIcon className='object-contain h-8' />,
  },
  {
    id: 2,
    name: '카카오뱅크',
    code: '090',
    logo: <KakaoBankIcon className='object-contain h-8' />,
  },
  {
    id: 3,
    name: '신한은행',
    code: '088',
    logo: <ShinhanBankIcon className='object-contain h-8' />,
  },
  { id: 4, name: '우리은행', code: '020', logo: <WooriBankIcon className='object-contain h-8' /> },
  { id: 5, name: '기업은행', code: '003', logo: <IBKIcon className='object-contain h-8' /> },
  { id: 6, name: '토스뱅크', code: '092', logo: <TossBankIcon className='object-contain h-8' /> },
  { id: 7, name: '우체국', code: '071', logo: <PostBankIcon className='object-contain h-8' /> },
  {
    id: 8,
    name: '농협은행',
    code: '011',
    logo: <NonghyupBankIcon className='object-contain h-8' />,
  },
  { id: 9, name: '하나은행', code: '081', logo: <HanaBankIcon className='object-contain h-8' /> },
];

const BankSelector = ({ onSelect }) => {
  const { selectedBank, isOpen, dropdownRef, toggleDropdown, selectBank } =
    useBankSelector(onSelect);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className='w-full h-10 pl-1 pr-4 flex items-center justify-between text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandOrange'
      >
        {selectedBank ? (
          <div className='flex items-center'>
            {selectedBank.logo}
            <span>{selectedBank.name}</span>
            <span className='ml-2 text-xs text-gray-500'>({selectedBank.code})</span>
          </div>
        ) : (
          <span className='pl-4'>은행을 선택하세요</span>
        )}
        <ChevronDownIcon className='w-5 h-5 ml-2 mr-1' />
      </button>

      {isOpen && (
        <div className='absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg'>
          <ul className='py-1 overflow-auto text-base rounded-md max-h-60 focus:outline-none sm:text-sm'>
            {banks.map((bank) => (
              <li
                key={bank.id}
                onClick={() => selectBank(bank)}
                className='flex items-center pl-1 pr-4 py-2 text-gray-900 cursor-pointer hover:bg-gray-100'
              >
                {bank.logo}
                <span>{bank.name}</span>
                <span className='ml-2 text-xs text-gray-500'>({bank.code})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BankSelector;

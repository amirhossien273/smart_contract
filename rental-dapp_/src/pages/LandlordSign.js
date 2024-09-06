import React, { useState, useEffect } from 'react';
import { connectToBlockchain, getContract, getWeb3 } from '../utils/web3';

function SignAgreement({ role }) {
  const [homeId, setHomeId] = useState('');
  const [agreement, setAgreement] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    async function loadBlockchain() {
      await connectToBlockchain();
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[2]);
    }
    loadBlockchain();
  }, []);

  const handleLoadAgreement = async () => {
    const contract = getContract();
    if (contract) {
      try {
        let agreementsData;
        if (role === 'tenant') {
            console.log(account);
          agreementsData = await contract.methods.getAgreementsByTenant(account).call();
        } else if (role === 'landlord') {
          agreementsData = await contract.methods.getAgreementsByLandlord(account).call();
        }
        console.log(agreementsData);
        setAgreement(agreementsData[0]);
      } catch (error) {
        console.error('خطا در دریافت قرارداد:', error);
        alert('خطا در دریافت قرارداد.');
      }
    }
  };

  const convertBigIntToNumber = (bigIntValue) => {
    if (typeof bigIntValue === 'bigint') {
      return Number(bigIntValue); // تبدیل BigInt به عدد
    }
    return bigIntValue;
  };

  const handleSign = async () => {
    const contract = getContract();
    const web3 = getWeb3();
    const gasPrice = await web3.eth.getGasPrice();
  
    if (contract && agreement) {
      try {
        if (!web3.utils.isAddress(account)) {
          alert('مقدار account صحیح نیست.');
          return;
        }
  
        // تبدیل homeId به عدد صحیح اگر نیاز باشد
        const homeIdNumber = Number(homeId);
        if (isNaN(homeIdNumber) || homeIdNumber < 0) {
          alert('مقدار homeId صحیح نیست.');
          return;
        }
        console.log(account, homeIdNumber);
        if (role === 'tenant') {
          await contract.methods.signContractAsTenant(account, homeIdNumber)
            .send({ 
              from: account,  
              gas: 3000000,
              gasPrice: gasPrice 
            });
          alert('مستأجر قرارداد را امضا کرد.');
        } else if (role === 'landlord') {
          await contract.methods.signContractAsLandlord(account, homeIdNumber)
            .send({ 
              from: account,  
              gas: 3000000,
              gasPrice: gasPrice 
            });
          alert('مالک قرارداد را امضا کرد.');
        }
      } catch (error) {
        console.error('خطا در امضای قرارداد:', error);
        alert('خطا در امضای قرارداد.');
      }
    }
  };

  return (
    <div className="container">
    <h2>{role === 'tenant' ? 'امضای قرارداد به عنوان مستأجر' : 'امضای قرارداد به عنوان مالک'}</h2>
    <input
      type="number"
      placeholder="شناسه ملک"
      value={homeId}
      onChange={(e) => setHomeId(e.target.value)}
    />
    <button onClick={handleLoadAgreement}>بارگیری قرارداد</button>

    {agreement && (
      <div className="details">
        <h3>جزئیات قرارداد</h3>
        <p><strong>شناسه ملک:</strong> {convertBigIntToNumber(agreement.home_id)}</p>
        <p><strong>قیمت:</strong> {convertBigIntToNumber(agreement.price)}</p>
        <p><strong>نوع قیمت:</strong> {agreement.price_type}</p>
        <p><strong>موبایل مستأجر:</strong> {agreement.tenant_mobile}</p>
        <p><strong>کد ملی مستأجر:</strong> {agreement.tenant_national_code}</p>
        <p><strong>موبایل مالک:</strong> {agreement.landlord_mobile}</p>
        <p><strong>کد ملی مالک:</strong> {agreement.landlord_national_code}</p>
        <p><strong>وضعیت قرارداد:</strong> {agreement.state}</p>

        <button onClick={handleSign}>
          {role === 'tenant' ? 'امضای مستأجر' : 'امضای مالک'}
        </button>
      </div>
    )}
  </div>
  );
}

export default SignAgreement;
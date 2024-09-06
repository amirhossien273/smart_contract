import React, { useState, useEffect } from 'react';
import { connectToBlockchain, getContract, getWeb3 } from '../utils/web3';

function ViewAgreement({ role }) {
  const [agreements, setAgreements] = useState([]);
  const [account, setAccount] = useState('');

  useEffect(() => {
    async function loadBlockchain() {
      await connectToBlockchain();
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      loadAgreements(accounts[2]);
    }
    loadBlockchain();
  }, []);

  const loadAgreements = async (account) => {
    const contract = getContract();
    if (contract) {
      try {
        let agreementsData;
        // if (role === 'tenant') {
        //   agreementsData = await contract.methods.getAgreementsByTenant(account).call();
        // } else if (role === 'landlord') {
          agreementsData = await contract.methods.getAgreementsByLandlord(account).call();
        // }
        console.log(account,agreementsData);
        setAgreements(agreementsData);
      } catch (error) {
        console.error('خطا در دریافت قراردادها:', error);
        alert('خطا در دریافت قراردادها.');
      }
    }
  };

  const convertBigIntToNumber = (bigIntValue) => {
    if (typeof bigIntValue === 'bigint') {
      return Number(bigIntValue); // تبدیل BigInt به عدد
    }
    return bigIntValue;
  };

  const getContractState = (state) => {
    switch (state) {
      case '0':
      case 0:
        return 'CREATED'; // قرارداد ایجاد شده است
      case '1':
      case 1:
        return 'STARTED'; // قرارداد امضا شده و شروع شده است
      case '2':
      case 2:
        return 'TERMINATED'; // قرارداد کنسل شده است
      default:
        return 'نامشخص'; // وضعیت ناشناخته
    }
  };
  

  return (
    <div className="container">
      <h2>قراردادهای شما</h2>
      {agreements.length === 0 ? (
        <p>هیچ قراردادی یافت نشد.</p>
      ) : (
        agreements.map((agreement, index) => (
          <div className="details1" key={index}>
            <p><strong>شناسه ملک:</strong> {convertBigIntToNumber(agreement.home_id)}</p>
            <p><strong>قیمت:</strong> {convertBigIntToNumber(agreement.price)}</p>
            <p><strong>نوع قیمت:</strong> {agreement.price_type}</p>
            <p><strong>موبایل مستأجر:</strong> {agreement.tenant_mobile}</p>
            <p><strong>کد ملی مستأجر:</strong> {agreement.tenant_national_code}</p>
            <p><strong>موبایل مالک:</strong> {agreement.landlord_mobile}</p>
            <p><strong>کد ملی مالک:</strong> {agreement.landlord_national_code}</p>
            <p><strong>وضعیت قرارداد:</strong> {getContractState(convertBigIntToNumber(agreement.state))}</p>
            <p>امضای مستاجر: {agreement.tenantSigned ? 'امضا شده' : 'امضا نشده'}</p>
            <p>امضای مالک: {agreement.landlordSigned ? 'امضا شده' : 'امضا نشده'}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewAgreement;
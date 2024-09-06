import React, { useState, useEffect } from 'react';
import { connectToBlockchain, getContract, getWeb3 } from '../utils/web3';
import './styles.css';

function CreateAgreement() {
  const [homeId, setHomeId] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState('');
  const [tenantMobile, setTenantMobile] = useState('');
  const [tenantNationalCode, setTenantNationalCode] = useState('');
  const [landlordMobile, setLandlordMobile] = useState('');
  const [landlordNationalCode, setLandlordNationalCode] = useState('');
  const [tenantPublicKey, setTenantPublicKey] = useState('');
  const [landlordPublicKey, setLandlordPublicKey] = useState('');
  const [account, setAccount] = useState('');

  useEffect(() => {
    const loadAccount = async () => {
      await connectToBlockchain();
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      setHomeId(123);
      setPrice('1000000');
      setPriceType('TreRED323ERcdwEE');
      setTenantMobile('09197340692');
      setLandlordMobile('09197340691');
      setTenantNationalCode('04406585845');
      setLandlordNationalCode('02205875885');
      setTenantPublicKey(accounts[1]);
      setLandlordPublicKey(accounts[2]);
    };
    loadAccount();
  }, []);

  const handleCreateAgreement = async () => {
    const contract = getContract();
    if (contract) {
      try {
        const web3 = getWeb3();
        const gasPrice = await web3.eth.getGasPrice();
  
        await contract.methods.setRentalAgreement(
          homeId,
          price,
          priceType,
          tenantMobile,
          tenantNationalCode,
          landlordMobile,
          landlordNationalCode,
          tenantPublicKey,
          landlordPublicKey
        ).send({
          from: account,
          gas: 3000000,
          gasPrice: gasPrice 
        });
  
        alert('قرارداد ایجاد شد.');
      } catch (error) {
        console.error('خطا در ایجاد قرارداد:', error);
        alert('خطا در ایجاد قرارداد.');
      }
    }
  };

  return (
    <div className="container">
      <h2>ایجاد قرارداد جدید</h2>
      <input type="text" placeholder="شناسه ملک" value={homeId} onChange={(e) => setHomeId(e.target.value)} />
      <input type="text" placeholder="قیمت" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="text" placeholder="نوع قیمت" value={priceType} onChange={(e) => setPriceType(e.target.value)} />
      <input type="text" placeholder="موبایل مستأجر" value={tenantMobile} onChange={(e) => setTenantMobile(e.target.value)} />
      <input type="text" placeholder="کد ملی مستأجر" value={tenantNationalCode} onChange={(e) => setTenantNationalCode(e.target.value)} />
      <input type="text" placeholder="موبایل مالک" value={landlordMobile} onChange={(e) => setLandlordMobile(e.target.value)} />
      <input type="text" placeholder="کد ملی مالک" value={landlordNationalCode} onChange={(e) => setLandlordNationalCode(e.target.value)} />
      <input type="text" placeholder="کلید عمومی مستأجر" value={tenantPublicKey} onChange={(e) => setTenantPublicKey(e.target.value)} />
      <input type="text" placeholder="کلید عمومی مالک" value={landlordPublicKey} onChange={(e) => setLandlordPublicKey(e.target.value)} />
      <button onClick={handleCreateAgreement}>ایجاد قرارداد</button>
    </div>
  );
}

export default CreateAgreement;
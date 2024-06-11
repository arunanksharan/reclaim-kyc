'use client';
import KYCForm from '@/ui/components/kyc';
import Image from 'next/image';
import { Reclaim } from '@reclaimprotocol/js-sdk';
import { useState } from 'react';
import QRCode from 'react-qr-code';

export default function Home() {
  const [url, setUrl] = useState<string>('');
  const APP_ID = '0x8D277Dfada493A5EA10F84CcA17B7519aF3A80c0';
  const reclaimClient = new Reclaim.ProofRequest(APP_ID);

  const providerIds = [
    '5e1302ca-a3dd-4ef8-bc25-24fcc97dc800', // Aadhaar Card Date of Birth
    '5e1302ca-a3dd-4ef8-bc25-24fcc97dc801', // Aadhaar Card Date of Birth v2
  ];

  async function generateVerificationRequest() {
    const providerId = providerIds[0];
    await reclaimClient.buildProofRequest(providerId);

    const signRes = await fetch(`/api/sign`, {
      method: 'POST',
      body: JSON.stringify({ appId: APP_ID, providerId }),
    });
    const { requestUrl, statusUrl } = await signRes.json();

    setUrl(requestUrl);
    await reclaimClient.startSession({
      onSuccessCallback: (proof) => {
        console.log('Verification success', proof);
        const data = proof.claimData.context.extractedParameters;
        // Your business logic here
      },
      onFailureCallback: (error) => {
        console.error('Verification failed', error);
        // Your business logic here to handle the error
      },
    });
  }

  return (
    <div className="min-w-full min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-white font-bold mb-4 text-4xl">KYC</h1>
      <div className="w-1/3">
        <form className="flex flex-col items-center justify-center w-full gap-4">
          <div className="w-full">
            <label htmlFor="firstName" className="hidden">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              className="text-white w-full p-2 border-2 border-gray-300 rounded-md bg-transparent"
            />
          </div>
          <div className="w-full">
            <label htmlFor="lastName" className="hidden">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              className="text-white w-full p-2 border-2 border-gray-300 rounded-md bg-transparent"
            />
          </div>
          <div className="w-full flex flex-col items-center justify-center">
            <label htmlFor="dob" className="hidden">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              className="w-full p-2 border-2 border-gray-300 rounded-md bg-transparent text-white input-date-icon-white"
            />
          </div>
          <div className="w-full">
            <label htmlFor="address" className="hidden">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address"
              className="text-white w-full p-2 border-2 border-gray-300 rounded-md bg-transparent"
            />
          </div>
          <button className="bg-blue-800 py-2 px-8 rounded-lg text-white font-semibold">
            Submit
          </button>
        </form>
        <div className="mt-10 flex items-center justify-center w-full">
          {!url && (
            <button
              className="px-8 py-2 rounded-lg bg-blue-800 text-white font-bold"
              onClick={generateVerificationRequest}
            >
              Create Claim QrCode
            </button>
          )}
          {url && <QRCode value={url} />}
        </div>
      </div>
    </div>
  );
}

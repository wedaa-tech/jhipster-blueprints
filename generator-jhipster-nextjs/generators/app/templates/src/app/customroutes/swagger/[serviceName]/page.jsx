import React from 'react';
import Swagger from '../../../components/Swagger';

function Page({params}) {
  const {serviceName} = params;
	const envKey = serviceName.toUpperCase();
	const serviceUrl = process.env[envKey];
  return (
    <div>
      <Swagger serviceUrl={serviceUrl} />
    </div>
  )
}

export default Page
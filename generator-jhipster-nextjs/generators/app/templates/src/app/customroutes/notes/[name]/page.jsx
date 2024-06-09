import React from 'react';

import Notes from '../../../components/Notes';

function page({params}) {

	const serviceName = params.name;
	const envKey = serviceName.toUpperCase();

	const serviceUrl = process.env[envKey];

  return (
	<Notes requestUrl={serviceUrl} />
  )
}

export default page
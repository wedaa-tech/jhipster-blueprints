'use client'

import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
<%_ if(oauth2) { _%>
  import { useSession } from 'next-auth/react';
<%_ } _%>

function Page({serviceUrl}) {
  <%_ if(oauth2) { _%>
    const authData = useSession();
    const {accessToken} = authData.data;
  <%_ } _%>

  return (
    <div>
        <%_ if(oauth2) { _%>
          <SwaggerUI url={serviceUrl.concat('/v3/api-docs')} requestInterceptor={(request)=>{
            request.headers.Authorization = `Bearer ${accessToken}`
            return request;
          }} />
        <%_ } else { _%>
          <SwaggerUI url={serviceUrl.concat('/v3/api-docs')} />
        <%_ } _%>
    </div>
  )
}

export default Page
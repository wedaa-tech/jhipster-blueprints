'use client';


import { signIn, useSession } from "next-auth/react";
import React from 'react'

function PrivateRoute({children}) {
    const authData = useSession({
        required:true,
        status:'unauthenticated',
        onUnauthenticated: ()=>{
            signIn('keycloak');
        }
    });
    const {status} = authData;

    if(status==='loading'||status==='unauthenticated'){
        return <h1>Redirecting you to the page</h1>
    }

  return (
    <>
    
        {children}
   
    </>
  )
}

export default PrivateRoute;
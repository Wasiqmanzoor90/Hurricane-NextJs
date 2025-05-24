
"use client";
import React from 'react'
import isAuthorised from '../../../../utils/isAuthorised'

function page() {
  isAuthorised();
  return (
    <div>page</div>
  )
}

export default page

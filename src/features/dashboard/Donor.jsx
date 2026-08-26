import React from 'react'
import { Logout } from '../../shared/components/Logout'
import DonationForm from '../donor/DonationForm'
import DonationList from '../donor/DonationList'

export const Donor = () => {
  return (
    <div>
      {/* 
          tab wise menu 
          |
          |
          |
          |
          |
          ||||||||
      */}
      Donor
        <hr/>
        <DonationForm />
        <hr/>
        <DonationList/>
        <hr/>
        <Logout/>
    </div>
  )
}

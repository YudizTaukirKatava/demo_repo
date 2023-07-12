import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import wallpaperLogin from '../../assets/images/wallpaper.jpg';

function AuthLayout({ children }) {
  return (
    <div className='auth-main'>
      <div className='auth-main-background-image'>
      </div>
      <div className='child-box-second'>
        <Suspense
          fallback={
            <div>
              <FormattedMessage id='loading' />
              ...
            </div>
          }>
          {children}
        </Suspense>
      </div>
    </div>
  )
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthLayout

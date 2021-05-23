import React, { useRef } from 'react';

const HamburgerOrExitIcon = ({
  menuOpen,
  openMenu,
  settingsOpen,
  openSettings,
  scrollYRef,
  scrollYRef2
}) => {
  
  
  if (menuOpen) {
    return (
      <React.Fragment>
        <img
        className='exitIcon'
        onClick={() => {
          var body = document.body
          body.style.position = ''
          
          openSettings(settingsOpen = false)
          openMenu(menuOpen = false)
        }}
          src="https://img.icons8.com/ios-filled/24/ffffff/x.png"
          alt=''
        />
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <img
        className='hamburgerIcon'
        onClick={() => {
          var body = document.body
          body.style.position = 'fixed'
          scrollYRef2.current = scrollYRef.current

          openSettings(settingsOpen = false)
          openMenu(menuOpen = true)
        }}
          src="https://img.icons8.com/fluent-systems-filled/32/ffffff/menu.png"
          alt=''
        />
      </React.Fragment>
    )
  }
}

export default HamburgerOrExitIcon;
// third party
import styled from 'styled-components'


export const TMain = styled.div`
  /* TOP MENU */
  .logo-menu {
    width: 90px;
  }

  .ui.menu.top-menu {
    border-radius: unset;
    border-top: unset !important;
  }

  .ui.menu.top-menu .menu-dropdown,
  .ui.menu.top-menu .dropdown .menu{
    z-index: 970;
  }

  .ui.top-menu-filter{
    z-index: 960;
  }

  .menu-dropdown {
    min-width: 300px !important;
  }

  .menu-dropdown-header,
  .menu-dropdown-button {
    padding: unset !important;
  }

  .ui.accordion.menu .item .title>.dropdown.icon {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
`
export const TPage = styled.div`
  min-height: calc(100vh - 40px);
  padding: 2rem 2rem;
`

export const LoginStyled = styled.div`
  padding: 2rem 2rem;
`
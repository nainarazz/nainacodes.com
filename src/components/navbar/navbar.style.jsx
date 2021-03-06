import styled from 'styled-components';
import themeColor from '../../config/theme';
// eslint-disable-next-line import/no-named-as-default
import media from '../../config/media';
import LinkWithActive from './link-with-active.component';

const { brand, color } = themeColor;

export const Container = styled.nav`
  position: fixed;
  z-index: 400;
  background-color: #fff;
  width: 100%;
  height: 75px;
  display: flex;
  box-shadow: ${(props) => (props.shouldShowShadow ? '0 9px 9px -9px rgba(0, 0, 0, 0.5)' : '')};
  transition: top 0.3s;
  top: ${(props) => (props.shouldHideHeader ? '-75px' : 0)};
  align-items: center;
`;

export const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 1.2em;
  width: 100%;
  color: ${brand.darkShade};
  max-width: 800px;
  margin: auto;
  ${media.desktop`padding: 0;`}
`;

export const Logo = styled.div`
  a {
    text-decoration: none;
    color: ${color.purple};
  }

  a:active,
  a:visited {
    color: ${color.purple};
  }

  img {
    height: 38px;
    width: 38px;
    vertical-align: middle;
    margin-bottom: 0;
  }

  span {
    margin-left: 10px;
    vertical-align: middle;
    font-weight: 600;
    display: none;
    ${media.tablet`display: inline;`}
  }

  &:hover {
    cursor: pointer;
  }
`;

export const MenuItems = styled.div`
  justify-content: space-between;
  display: flex;
  line-height: 2;
`;

export const StyledLink = styled(LinkWithActive)`
  font-size: 0.9rem;
  text-decoration: none;
  color: ${brand.darkShade};
  margin-left: 30px;

  &.active {
    span {
      border-bottom: 5px solid ${brand.darkShade};
      padding-bottom: 5px;
    }
  }

  span {
    &:hover {
      cursor: pointer;
      border-bottom: 5px solid ${brand.darkShade};
      padding-bottom: 5px;
    }
  }
`;

import { Link } from "react-router-dom"
import styled, { getTColor } from "./styled"

export const Wrapper = styled.div`
  min-width: 1080px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const StyledLogo = styled.img`
  height: 44px;
  font-size: 0;
  display: block;
  margin-right: 10px;
  transform: scale(0.9);
`

export const StyledHeaderItem = styled(Link)`
  padding: 11px 12px;
  font-size: 14px;
  color: #fff;
  display: block;
  text-decoration: none;
  :hover {
    background-color: ${getTColor('cyan', '7')};
  }
  &.active {
    background-color: ${getTColor('cyan', '8')};
  }
`

export const StyledHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const StyledHeaderContentLeft = styled.div`
  display: flex;
`

export const StyledHeader = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  height: 44px;
  justify-content: center;
  background-color: ${getTColor('cyan', '6')};
  z-index: 33;
  ${StyledHeaderContent} {
    width: 80%;
  }
`

export const StyledMain = styled.div`
  display: flex;
  padding-top: 60px;
  flex: 1;
`

export const StyledFooter = styled.div`
  display: flex;
  background-color: #000;
  color: #fff;
  padding: 5px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  span, a {
    margin-left: 5px;
    &:last-child {
      margin-right: 0;
    }
  }
`

export const StyledLeftSide = styled.div`
  flex: 1;
`

export const StyledContent = styled.div`
  width: 85%;
  height: 100%;
  padding-right: 16px;
`

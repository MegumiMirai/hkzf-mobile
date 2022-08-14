import React from "react";
import {NavBar} from "antd-mobile";
import {useNavigate} from "react-router";
import PropTypes from 'prop-types'

// import './index.css'

import styles from './index.module.css'

export default function NavHeader({children, onLeftClick}){
  const navigate = useNavigate()
  //默认点击行为
  const defaultHandler = () => { navigate(-1) }

  return (
        <NavBar onBack={ onLeftClick || defaultHandler } className={styles.navBar}>{children}</NavBar>
  )
}

//添加props校验
NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func
}
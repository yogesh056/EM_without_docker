import React from 'react';
import PropTypes from 'prop-types';
import GitHubButton from 'react-github-button';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import BingMaps from "../../components/Inputs/BingMaps"
import BannerSVGAnim from './BannerSVGAnim';

function Banner(props) {
  return (
    [<div className="banner-wrapper" style={{width:"50%", margin:"0 auto"}}>
      {props.isMobile && (
        <TweenOne animation={{ opacity: 1 }} className="banner-image-wrapper">
          <div className="home-banner-image">
            <img
              alt="banner"
              src="https://gw.alipayobjects.com/zos/rmsportal/rqKQOpnMxeJKngVvulsF.svg"
              width="100%"
            />
          </div>
        </TweenOne>
      )}
      <QueueAnim className="banner-title-wrapper" type={props.isMobile ? 'bottom' : 'right'}>
        <div key="line" className="title-line-wrapper">
          <div
            className="title-line"
            style={{ transform: 'translateX(-64px)' }}
          />
        </div>
        <h1 key="h1">ASTUTE EVENT HORIZON</h1>
        <p key="content">
          EXPLORE THE EVENTS
        </p>
        <div key="button" className="button-wrapper">
          <a href="" target="_blank" rel="noopener noreferrer">
            <Button type="primary">
            <Link to="/events">Get Started</Link>
            </Button>
          </a>
          <Button style={{ margin: '0 16px' }} type="primary" ghost>
          Affix
          </Button>
        </div>
      </QueueAnim>
      {!props.isMobile && (
        <TweenOne animation={{ opacity: 1 }} className="banner-image-wrapper">
          <BannerSVGAnim />
        </TweenOne>
      )}
    </div>,
    ]
  );
}

Banner.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

export default Banner;

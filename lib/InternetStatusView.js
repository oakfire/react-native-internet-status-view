/**
 * Created by Ismail M.I.M
 *
 *
 */

'use strict'

import {
  Text,
  NetInfo,
  Animated,
  Easing
} from 'react-native'
import React, { Component } from 'react'
const styles = require('./InternetStatusViewStyles')
const DEFAULT_COMPONENT_HEIGHT = 25

let componentHeight = 0

export default class InternetStatusView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: true,
      heightValue: new Animated.Value(0)
    }
    this._updateConnectionStatus = this._updateConnectionStatus.bind(this);
  }

  componentWillMount() {
    if (this.props.style) {
      componentHeight = this.props.style.height || DEFAULT_COMPONENT_HEIGHT;
    }
    NetInfo.isConnected.fetch().then(isConnected => { this._updateConnectionStatus(isConnected) });
    NetInfo.isConnected.addEventListener('connectionChange', this._updateConnectionStatus);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._updateConnectionStatus);
  }

  _updateConnectionStatus(isConnected) {
    this.setState({ isConnected });
    this.animateErrorView(isConnected);
  }

  animateErrorView(visibility) {
    if (!visibility) {
      Animated.timing(
        this.state.heightValue,
        {
          toValue: componentHeight,
          easing: Easing.linear,
          duration: 400
        }
      ).start()
    } else {
      Animated.timing(
        this.state.heightValue,
        {
          toValue: 0,
          easing: Easing.linear,
          duration: 400
        }
      ).start()
    }
  }

  render() {
    let textToDisplay = this.props.textToDisplay || 'No Internet Connection';
    let errorTextContainer = this.props.style || styles.errorTextContainer;
    return (
      <Animated.View style={[errorTextContainer, { height: this.state.heightValue }]} >
        <Text style={styles.errorTextShow}>{textToDisplay}</Text>
      </Animated.View>
    )
  }
}

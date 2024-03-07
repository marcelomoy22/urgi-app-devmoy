import { Button, Col, Grid, Icon } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import {RNCamera} from 'react-native-camera';
import { connect } from 'react-redux';

import { setBarcode, setImagePath } from '../../../actions/driver/camera';
import { askStoragePermissions } from '../../../actions/permissions';
import { popRoute } from '../../../actions/route';
import { DRIVER_CAMERA_STORAGE_DENIED_ALERT } from '../../../textStrings';
import styles from './styles';

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.driver.appState.jwtAccessToken,
  };
}

class CameraComponent extends Component {
  static propTypes = {
    popRoute: PropTypes.func,
    setImagePath: PropTypes.func,
    setBarcode: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      btn: false,
      flash: false,
    };
  }

  goBack() {
    this.props.popRoute();
  }

  flashBtn() {
    this.setState({
      flash: !this.state.flash,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          style={styles.preview}
          // videoStabilizationMode={RNCamera.Constants.VideoStabilization.auto}
          // captureTarget={RNCamera.Constants.CaptureTarget.disk}
          // defaultVideoQuality={RNCamera.Constants.VideoQuality["480p"]}
          flashMode={this.state.flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        >
          <Grid style={{width: 400}}>
            <Col>
              <Button style={styles.flash} disabled={this.state.btn} onPress={() => this.flashBtn()}>
                <Icon name='ios-flash' />
              </Button>
            </Col>
            <Col>
              <Button style={styles.exit} disabled={this.state.btn} onPress={() => this.goBack()}>
                <Icon name='ios-close' />
              </Button>
            </Col>
          </Grid>

          <View style={{width: 400}}>
            <Button style={styles.capture} disabled={this.state.btn} onPress={this.takePicture.bind(this)}>
              <Icon name='ios-camera' />
            </Button>
          </View>
        </RNCamera>
      </View>
    );
  }

  onBarCodeRead(code) {
    if (!this.state.btn) this.takePicture(code.data);
  }

  async takePicture(code) {
    /*const permission = await askStoragePermissions();
    if (permission) {*/
      this.setState({ btn: true });
      const options = { quality: 0.5, base64: true };

      this.camera
        .takePictureAsync(options)
        .then((data) => {
          this.props.setImagePath(data.uri);
          this.goBack();
          if (typeof code === 'string' || code instanceof String) this.props.setBarcode(code);
        })
        .catch((e) => alert(e));
    // } else alert(DRIVER_CAMERA_STORAGE_DENIED_ALERT);
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    setImagePath: (data) => dispatch(setImagePath(data)),
    setBarcode: (code) => dispatch(setBarcode(code)),
  };
}

export default connect(mapStateToProps, bindActions)(CameraComponent);

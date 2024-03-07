/* eslint-disable no-unused-expressions */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BackHandler, StatusBar } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import Drawer from 'react-native-drawer';
import { connect } from 'react-redux';

import { closeDrawer } from './actions/drawer';
import { popRoute } from './actions/route';
import Chat from './components/common/chat';
import Coupons from './components/common/coupons';
import History from './components/common/history';
import Folios from './components/common/history/folios';
import Login from './components/common/login/';
import NextTrips from './components/common/nextTrips';
import Register from './components/common/register/';
import Settings from './components/common/settings';
import SideBar from './components/common/sideBar';
import SignIn from './components/common/signIn/';
import PasswordRecovery from './components/common/signIn/passwordRecovery';
import VipData from './components/common/vipData';
import Camera from './components/driver/camera';
import CaptureTicket from './components/driver/captureTicket';
import DropOff from './components/driver/dropOff';
import DriverHome from './components/driver/home';
import PickRider from './components/driver/pickRider';
import RateRider from './components/driver/rateRider';
import RideRequest from './components/driver/rideRequest';
import DriverRootView from './components/driver/rootView';
import StartRide from './components/driver/startRide';
import DriverStartupService from './components/driver/startupServices';
import MakePayment from './components/driver/makePayment';
import Billing from './components/rider/billing';
import CardPayment from './components/rider/cardPayment';
import ConfirmRide from './components/rider/confirmRide';
import CreditCard from './components/rider/creditCard';
import Favorites from './components/rider/favorites';
import SearchDriver from './components/rider/favorites/search';
import Home from './components/rider/home/';
import Notifications from './components/rider/notifications';
import Payment from './components/rider/payment';
import Receipt from './components/rider/receipt';
import RideBooked from './components/rider/rideBooked';
import RootView from './components/rider/rootView';
import AddLocation from './components/rider/savedLocations/addLocation';
import SelectLocation from './components/rider/savedLocations/selectLocation';
import RiderStartupService from './components/rider/startupServices';
import TripDetails from './components/rider/tripDetails';
import TripIncidents from './components/rider/tripIncidents';
import TripIncidentsForm from './components/rider/tripIncidentsForm';
import SplashPage from './components/splashscreen/';
import { statusBarColor } from './themes/base-theme';

console.disableYellowBox = true;
// navigation animation
Navigator.prototype.replaceWithAnimation = function replaceWithAnimation(route) {
  const activeLength = this.state.presentedIndex + 1;
  const activeStack = this.state.routeStack.slice(0, activeLength);
  const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
  const nextStack = activeStack.concat([route]);
  const destIndex = nextStack.length - 1;
  const nextSceneConfig = this.props.configureScene(route, nextStack);
  const nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig]);

  const replacedStack = activeStack.slice(0, activeLength - 1).concat([route]);
  this._emitWillFocus(nextStack[destIndex]);
  this.setState(
    {
      routeStack: nextStack,
      sceneConfigStack: nextAnimationConfigStack,
    },
    () => {
      this._enableScene(destIndex);
      this._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity, null, () => {
        this.immediatelyResetRouteStack(replacedStack);
      });
    }
  );
};

export const globalNav = {};

class AppNavigator extends Component {
  static propTypes = {
    drawerState: PropTypes.string,
    popRoute: PropTypes.func,
    closeDrawer: PropTypes.func,
    riderJwtAccessToken: PropTypes.string,
    driverJwtAccessToken: PropTypes.string,
  };

  componentDidMount() {
    globalNav.navigator = this._navigator;
    globalNav.drawer = this._drawer;

    // setTimeout(() => {
    //   this.openDrawer();
    // }, 1000);

    this.props.drawerState === 'opened';
    this.closeDrawer();

    // BackHandler for newer react versions.
    BackHandler.addEventListener('hardwareBackPress', () => {
      const routes = this._navigator.getCurrentRoutes();

      if (routes[routes.length - 1].id === 'home' || routes[routes.length - 1].id === 'login') {
        // Close the app
        return false;
      }
      this.popRoute();
      return true;
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.drawerState === 'opened') {
      this.openDrawer();
    }

    if (nextProps.drawerState === 'closed') {
      this._drawer.close();
    }
  }

  popRoute() {
    this.props.popRoute();
  }

  openDrawer() {
    this._drawer.open();
  }

  closeDrawer() {
    if (this.props.drawerState === 'opened') {
      this.props.closeDrawer();
    }
  }
  renderScene(route, navigator) {
    // eslint-disable-line class-methods-use-this
    if (route.component) {
      return <Component navigator={navigator} route={route} {...route.passProps} />;
    }
    switch (route.id) {
      case 'riderStartupService':
        return <RiderStartupService navigator={navigator} />;
      case 'splashscreen':
        return <SplashPage navigator={navigator} />;
      case 'riderRootView':
        return <RootView navigator={navigator} />;
      case 'driverRootView':
        return <DriverRootView navigator={navigator} />;
      case 'home':
        return <Home navigator={navigator} />;
      case 'sideBar':
        return <SideBar navigator={navigator} />;
      case 'billing':
        return <Billing navigator={navigator} />;
      case 'vipData':
        return <VipData navigator={navigator} />;
      case 'payment':
        return <Payment navigator={navigator} />;
      case 'cardPayment':
        return <CardPayment navigator={navigator} />;
      case 'settings':
        return <Settings navigator={navigator} />;
      case 'makePayment':
        return <MakePayment navigator={navigator} />;  
      case 'history':
        return <History navigator={navigator} />;
      case 'folios':
        return <Folios navigator={navigator} />;
      case 'nextTrips':
        return <NextTrips navigator={navigator} />;
      case 'notifications':
        return <Notifications navigator={navigator} />;
      case 'creditCard':
        return <CreditCard navigator={navigator} />;
      case 'confirmRide':
        return <ConfirmRide navigator={navigator} />;
      case 'rideBooked':
        return <RideBooked navigator={navigator} />;
      case 'receipt':
        return <Receipt navigator={navigator} />;
      case 'login':
        return <Login navigator={navigator} />;
      case 'signIn':
        return <SignIn navigator={navigator} />;
      case 'register':
        return <Register navigator={navigator} />;
      case 'driverStartupService':
        return <DriverStartupService navigator={navigator} />;
      case 'driverHome':
        return <DriverHome navigator={navigator} />;
      case 'rideRequest':
        return <RideRequest navigator={navigator} />;
      case 'pickRider':
        return <PickRider navigator={navigator} />;
      case 'startRide':
        return <StartRide navigator={navigator} />;
      case 'dropOff':
        return <DropOff navigator={navigator} />;
      case 'rateRider':
        return <RateRider navigator={navigator} />;
      case 'captureTicket':
        return <CaptureTicket navigator={navigator} />;
      case 'camera':
        return <Camera navigator={navigator} />;
      case 'coupons':
        return <Coupons navigator={navigator} />;
      case 'tripDetails':
        return <TripDetails navigator={navigator} />;
      case 'tripIncidentsForm':
        return <TripIncidentsForm navigator={navigator} />;
      case 'tripIncidents':
        return <TripIncidents navigator={navigator} />;
      case 'passwordRecovery':
        return <PasswordRecovery navigator={navigator} />;
      case 'favorites':
        return <Favorites navigator={navigator} />;
      case 'searchDriver':
        return <SearchDriver navigator={navigator} />;
      case 'addLocation':
        return <AddLocation navigator={navigator} />;
      case 'selectLocation':
        return <SelectLocation navigator={navigator} />;
      case 'chat':
        return <Chat navigator={navigator} />;

      default:
        return <Login navigator={navigator} />;
    }
  }

  render() {
    let initialRoute;
    if (!this.props.riderJwtAccessToken && this.props.driverJwtAccessToken !== undefined) {
      initialRoute = { id: 'driverStartupService', statusBarHidden: true };
    } else if (this.props.riderJwtAccessToken !== undefined && !this.props.driverJwtAccessToken) {
      initialRoute = { id: 'riderStartupService', statusBarHidden: true };
    } else {
      initialRoute = { id: 'splashscreen', statusBarHidden: true };
    }

    return (
      <Drawer
        ref={(ref) => {
          this._drawer = ref;
        }}
        type='overlay'
        content={<SideBar navigator={this._navigator} />}
        tapToClose
        acceptPan={false}
        onClose={() => this.closeDrawer()}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        negotiatePan
      >
        <StatusBar backgroundColor={statusBarColor} />
        <Navigator
          ref={(ref) => {
            this._navigator = ref;
          }}
          configureScene={() => Navigator.SceneConfigs.FloatFromRight}
          initialRoute={initialRoute}
          renderScene={this.renderScene}
        />
      </Drawer>
    );
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    popRoute: () => dispatch(popRoute()),
  };
}

const mapStateToProps = (state) => ({
  drawerState: state.drawer.drawerState,
  riderJwtAccessToken: state.rider.appState.jwtAccessToken,
  driverJwtAccessToken: state.driver.appState.jwtAccessToken,
});

export default connect(mapStateToProps, bindAction)(AppNavigator);

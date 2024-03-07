//import { REHYDRATE } from 'redux-persist';

import { POP_ROUTE, POP_TO_ROUTE, PUSH_NEW_ROUTE, REPLACE_OR_PUSH_ROUTE, REPLACE_ROUTE, RESET_ROUTE } from '../actions/route';
import { globalNav } from '../AppNavigator';
import { closeDrawer } from '../actions/drawer'

import type { Action } from '../actions/types';
export type State = {
  routes: Array<string>,
};

const initialState = {
  routes: ['login'],
};

export default function (state: State = initialState, action: Action): State {
  if (action.type === PUSH_NEW_ROUTE) {
    const routes = state.routes;
    if (routes[routes.length - 1] !== action.route) {
      globalNav.navigator.push({ id: action.route });
      return {
        routes: [...state.routes, action.route],
      };
    }
  }

  if (action.type === REPLACE_ROUTE) {
    globalNav.navigator.replaceWithAnimation({ id: action.route });
    const routes = state.routes;
    routes.pop();
    return {
      routes: [...routes, action.route],
    };
  }
  if (action.type === RESET_ROUTE) {
    globalNav.navigator.immediatelyResetRouteStack(['riderStartupService'])
    console.log('RESET_ROUTE_TO_NEW',globalNav.navigator.getCurrentRoutes())
    return {
      ...initialState
    }
  }

  // For sidebar navigation
  if (action.type === REPLACE_OR_PUSH_ROUTE) {
    let routes = state.routes;

    if (routes[routes.length - 1] === 'home') {
      // If top route is home and user navigates to a route other than home, then push
      if (action.route !== 'home') {
        globalNav.navigator.push({ id: action.route });
      } else {
        // If top route is home and user navigates to home, do nothing
        routes = [];
      }
    } else if (action.route === 'home') {
      globalNav.navigator.resetTo({ id: 'home' });
      routes = [];
    } else {
      globalNav.navigator.replaceWithAnimation({ id: action.route });
      routes.pop();
    }

    return {
      routes: [...routes, action.route],
    };
  }

  if (action.type === POP_ROUTE) {
    globalNav.navigator.pop();
    const routes = state.routes;
    routes.pop();
    return {
      routes,
    };
  }

  if (action.type === POP_TO_ROUTE) {
    globalNav.navigator.popToRoute({ id: action.route });
    const routes = state.routes;
    while (routes.pop() !== action.route) {
      // keep popping till you get to the route
    }
    return {
      routes: [...routes, action.route],
    };
  }

  // if (action.type === REHYDRATE) {
  //   const savedData = action?.payload?.route || state;
  //   return {
  //     ...savedData,
  //   };
  // }

  return state;
}

import {useContext} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {AuthContext} from '../context/authentication/AuthContext';

import {ProtectedScreen} from '../screens/ProtectedScreen';
import {RegisterScreen} from '../screens/RegisterScreen';
import {LoadingScreen} from '../screens/LoadingScreen';
import {ProductsNavigator} from './ProductsNavigator';
import {LoginScreen} from '../screens/LoginScreen';

const Stack = createStackNavigator();

export const Navigator = () => {
  const {status} = useContext(AuthContext);

  if (status === 'checking') return <LoadingScreen />;

  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      {status !== 'authenticated' ? (
        <>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="ProductsNavigator"
            component={ProductsNavigator}
          />
          <Stack.Screen name="ProtectedScreen" component={ProtectedScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

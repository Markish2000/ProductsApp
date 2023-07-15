import {NavigationContainer} from '@react-navigation/native';
import {Navigator} from './src/Navigator';

import {AuthProvider} from './src/context/authentication/AuthContext';
import {ProductsProvider} from './src/context/products/ProductContext';

const AppState = ({children}: {children: JSX.Element | JSX.Element[]}) => {
  return (
    <AuthProvider>
      <ProductsProvider>{children}</ProductsProvider>
    </AuthProvider>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  );
};

export default App;

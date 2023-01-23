import './src/libs/dayjs';
import { StatusBar } from 'react-native';

// config fonts
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { Loading } from './src/components/Loading'; // mostrar enquanto as fontes são carregadas

import { Routes } from './src/routes';

export default function App() {
  // config fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular, 
    Inter_600SemiBold, 
    Inter_700Bold, 
    Inter_800ExtraBold
  })
  if (!fontsLoaded) {
    return <Loading />;
  }
  // config fonts

  return (
    <>
      <Routes />
      <StatusBar barStyle={'light-content'} backgroundColor="transparent" translucent />
    </>
  );
}

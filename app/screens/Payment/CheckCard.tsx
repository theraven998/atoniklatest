import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

export default function TestScreen() {
  const insets = useSafeAreaInsets();
  console.log("SafeAreaInsets:", insets); // 👈 Para ver si llega correctamente

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Text>Top inset: {insets.top}</Text>
      <Text>Bottom inset: {insets.bottom}</Text>
    </View>
  );
}
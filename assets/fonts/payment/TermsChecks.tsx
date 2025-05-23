import React, { useState } from 'react';
import { Linking, Text, View, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useAppTheme } from "@/constants/theme/useTheme";
interface ConsentCheckboxesProps {
  regulationLink: string;
  privacyLink: string;
  onChange: (state: { checked1: boolean; checked2: boolean }) => void;
}

export default function ConsentCheckboxes({
  regulationLink,
  privacyLink,
  onChange,
}: ConsentCheckboxesProps) {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('Error al abrir el enlace:', err)
    );
  };

  const toggleChecked1 = () => {
    const newValue = !checked1;
    setChecked1(newValue);
    onChange({ checked1: newValue, checked2 });
  };

  const toggleChecked2 = () => {
    const newValue = !checked2;
    setChecked2(newValue);
    onChange({ checked1, checked2: newValue });
  };
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Checkbox
          status={checked1 ? 'checked' : 'unchecked'}
          onPress={toggleChecked1}
          color={theme.colors.primary} // Amarillo
        />
        <Text style={[styles.text, {color: theme.colors.text}]}>
          Acepto{' '}
          <Text  >
            haber leído los reglamentos
          </Text>{' '}
          y{' '}
          <Text style={[styles.link,{color: theme.colors.secondary}]}onPress={() => openLink(regulationLink)}>
            la política de privacidad
          </Text>{' '}
          para hacer este pago.
        </Text>
      </View>

      <View style={styles.row}>
        <Checkbox
          status={checked2 ? 'checked' : 'unchecked'}
          onPress={toggleChecked2}
          color={theme.colors.primary}  // Amarillo
        />
        <Text style={[styles.text, {color: theme.colors.text}]}>
          Acepto{' '}
          <Text  onPress={() => openLink(privacyLink)} style={[styles.link,{color: theme.colors.secondary}]}>
            la autorización para la administración de datos personales
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  text: {
    flex: 1,
    color: '#333',
    fontSize: 14,
    fontWeight:"100",
  },
  link: {
    color: '#5a80c0',
  
    fontWeight: '300',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
});

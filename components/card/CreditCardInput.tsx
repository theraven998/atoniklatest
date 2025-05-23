
import { useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Icons from './Icons';
import {
  useCreditCardForm,
  type CreditCardFormData,
  type CreditCardFormField,
} from './useCreditCardForm';
import { useAppTheme } from "@/constants/theme/useTheme";
interface Props {
  autoFocus?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  placeholderColor?: string;
  labels?: {
    number: string;
    expiry: string;
    cvc: string;
  };
  placeholders?: {
    number: string;
    expiry: string;
    cvc: string;
  };
  onChange: (formData: CreditCardFormData) => void;
  onFocusField?: (field: CreditCardFormField) => void;
  testID?: string;
}

const getStyles = (theme) => StyleSheet.create({
  container: {

    paddingHorizontal: "7%",
  },
  icon: {
    width: 29,
    height: 40,
    resizeMode: 'contain',
  },
  numberInput: {        marginTop: 15,},
  extraContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  expiryInputContainer: {
    flex: 1,
    marginRight: 5,
  },
  cvcInputContainer: {
    flex: 1,
    marginLeft: 5,
  },
  input: {
    
    fontSize: 15,
    backgroundColor: theme.colors.card,
    paddingVertical: 12,
    alignContent: 'center',
    paddingHorizontal: 15,
    color: theme.colors.text,

   
    justifyContent: 'center',
    borderRadius: 13,
  
  
  },
  inputLabel: {
    fontSize: 15,
    marginLeft:4,
    marginBottom: 5,
    fontWeight: 300,
    color: "#cbc2ff",
  },
});

const CreditCardInput = (props: Props) => {
  const theme = useAppTheme();
  const s = getStyles(theme);
  const {
    autoFocus,
    style,
    labelStyle,
    inputStyle,
    placeholderColor = '#636161',
    labels = {
      name: 'Nombre',
      number: 'Numero de tarjeta',
      expiry: 'Expiracion ',
      cvc: 'CVC/CVV',
    },
    placeholders = {
      name: 'Ingresa tu nombre',
      number: 'Numero de tarjeta',
      expiry: 'MM/YY',
      cvc: 'CVC',
    },
    onChange = () => {},
    onFocusField = () => {},
    testID,
  } = props;

  const { values, onChangeValue } = useCreditCardForm(onChange);

  const numberInput = useRef<TextInput>(null);
  const nameInput = useRef<TextInput>(null);
  useEffect(() => {
    if (autoFocus) nameInput.current?.focus();
  }, [autoFocus]);

  const cardIcon = useMemo(() => {
    if (values.type && Icons[values.type]) return Icons[values.type];
    return Icons.placeholder;
  }, [values.type]);
  return (
    <View
      style={[s.container, style]}
      testID={testID}
    >
      <View style={[s.numberInput]}>
       
        <TextInput
          ref={nameInput}
          maxLength={20}
          style={[s.input, inputStyle]}
          placeholderTextColor={placeholderColor}
          placeholder={placeholders.name}
          value={values.name}
          onChangeText={(v) => onChangeValue('name', v)}
          onFocus={() => onFocusField('name')}
          autoCorrect={false}
          underlineColorAndroid={'transparent'}
          testID="CC_NAME"
        />
      </View>
      <View style={[s.numberInput, ]}>
  <TextInput
    ref={numberInput}

    style={[s.input, { paddingRight: 40 }]} // Asegúrate de dejar espacio para la imagen
    placeholderTextColor={placeholderColor}
    placeholder={placeholders.number}
    value={values.number}
    onChangeText={(v) => onChangeValue('number', v)}
    onFocus={() => onFocusField('number')}
    autoCorrect={false}
    underlineColorAndroid={'transparent'}
    testID="CC_NUMBER"
  />
  <Image
    style={[s.icon, { position: 'absolute', right: 20 }]} // Posiciona la imagen dentro del input
    source={{ uri: cardIcon }}
  />
</View>


      <View style={[s.extraContainer]}>
        <View style={s.expiryInputContainer}>
          <Text style={[s.inputLabel, labelStyle]}>{labels.expiry}</Text>
          <TextInput

            style={[s.input, inputStyle]}
            placeholderTextColor={placeholderColor}
            placeholder={placeholders.expiry}
            value={values.expiry}
            onChangeText={(v) => onChangeValue('expiry', v)}
            onFocus={() => onFocusField('expiry')}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            testID="CC_EXPIRY"
          />
        </View>

        <View style={s.cvcInputContainer}>
          <Text style={[s.inputLabel, labelStyle]}>{labels.cvc}</Text>
          <TextInput
        
            style={[s.input, inputStyle]}
            placeholderTextColor={placeholderColor}
            placeholder={placeholders.cvc}
            value={values.cvc}
            onChangeText={(v) => onChangeValue('cvc', v)}
            onFocus={() => onFocusField('cvc')}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            testID="CC_CVC"
          />
        </View>
      </View>
    </View>
  );
};

export default CreditCardInput; 
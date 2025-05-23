import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  Dimensions,
  View,
  type ImageSourcePropType,
  type ViewStyle,
} from 'react-native';
import FlipCard from 'react-native-flip-card';
import Icons from './Icons';
import { useMemo } from 'react';
import type { CreditCardIssuer } from './useCreditCardForm';
const { height, width } = Dimensions.get('window');
const CARD_SIZE = { width: height*0.35, height: height * 0.217};
import { useAppTheme } from "@/constants/theme/useTheme";

const getStyles = (theme, height, width) => StyleSheet.create({
  cardContainer: {
   padding: 0,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   elevation: 5,

  },
  cardFace: {

    borderRadius: 20,
    margin:0,
    
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardMagneticStripe: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 30,
    height: 40,
    backgroundColor: '#000',
  },
  icon: {
    position: 'absolute',
    bottom:height * 0.03,
    right: 18,
    width: 50,
    height: 35,
    resizeMode: 'contain',
  },
  baseText: {
    color: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent',
  },
  placeholder: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  focusedField: {
    fontWeight: '300',
    color: '#ffffffac',
    
  },
  number: {
    fontSize: 14
    ,
    position: 'absolute',
    bottom:height * 0.13,
    left: 18,
    letterSpacing: 2,
  },
  name: {
    fontSize: 14,
    position: 'absolute',
    bottom:height * 0.05,
    left: 18,
  
  },
  expiryLabel: {
    fontSize: 10,
    position: 'absolute',
    bottom: 40,
    left: 218,
  },
  expiry: {
    fontSize: 16,
    position: 'absolute',
    bottom: 20,
    left: 220,
  },
  amexCVC: {
    fontSize: 16,
    position: 'absolute',
    top: 73,
    right: 30,
  },
  cvc: {
    fontSize: 16,
    position: 'absolute',
    top: 80,
    right: 30,
  },
});

interface Props {
  focusedField?: 'name' | 'number' | 'expiry' | 'cvc';
  type?: CreditCardIssuer;
  name?: string;
  number?: string;
  expiry?: string;
  cvc?: string;

  placeholders?: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  };
  style?: ViewStyle;

  fontFamily?: string;
  imageFront?: ImageSourcePropType;
  imageBack?: ImageSourcePropType;
}

const CreditCardView = (props: Props) => {
  const theme = useAppTheme();
  const s = getStyles(theme,width,height);
  const {
    focusedField,
    type,
    name,
    number,
    expiry,
    cvc,
    placeholders = {
      number: '•••• •••• •••• ••••',
      name: '',
      expiry: '••/••',
      cvc: '•••',
    },
    imageFront,
    imageBack,
    fontFamily = Platform.select({
      ios: 'Courier',
    
      web: 'monospace',
    }),
    style,
  } = props;

  const isAmex = type === 'american-express';
  const shouldShowCardBack = !isAmex && focusedField === 'cvc' || focusedField === 'expiry';

  const cardIcon = useMemo(() => {
    if (type && Icons[type]) return Icons[type];
    return null;
  }, [type]);

  return (
    <View style={[s.cardContainer, CARD_SIZE, style]}>
      <FlipCard
        flipHorizontal
        flipVertical={false}
        friction={50}
        perspective={2000}
        clickable={false}
        flip={shouldShowCardBack}
      >
        <ImageBackground
          style={[CARD_SIZE, s.cardFace]}
          source={imageFront}
        >
          {!!cardIcon && (
            <Image
              style={[s.icon]}
              source={{ uri: cardIcon }}
            />
          )}

          <Text
            style={[
              s.baseText,
              { fontFamily },
              s.number,
              !number && s.placeholder,
              focusedField === 'number' && s.focusedField,
            ]}
          >
            {!number ? placeholders.number : number}
          </Text>
          <Text
  style={[
    s.baseText,
    { fontFamily },
    s.name,
    !name && s.placeholder,
    focusedField === 'name' && s.focusedField,
  ]}
  numberOfLines={1}
>
  {!name ? placeholders.name : name.toUpperCase()}
</Text>

          {isAmex && (
            <Text
              style={[
                s.baseText,
                { fontFamily },
                s.amexCVC,
                !cvc && s.placeholder,
                focusedField === 'cvc' && s.focusedField,
              ]}
            >
              {!cvc ? placeholders.cvc : cvc}
            </Text>
          )}
        </ImageBackground>

        <ImageBackground
          style={[CARD_SIZE, s.cardFace]}
          source={imageBack}
        >
          <View style={s.cardMagneticStripe} />
          <Text
            style={[
              s.baseText,
              s.cvc,
              !cvc && s.placeholder,
              focusedField === 'cvc' && s.focusedField,
            ]}
          >
            {!cvc ? placeholders.cvc : cvc}
          </Text>

          <Text
            style={[
              s.baseText,
              { fontFamily },
              s.expiryLabel,
              s.placeholder,
              focusedField === 'expiry' && s.focusedField,
            ]}
          >
            MONTH/YEAR
          </Text>
          <Text
            style={[
              s.baseText,
              { fontFamily },
              s.expiry,
              !expiry && s.placeholder,
              focusedField === 'expiry' && s.focusedField,
            ]}
          >
            {!expiry ? placeholders.expiry : expiry}
          </Text>

        </ImageBackground>
      </FlipCard>
    </View>
  );
};

export default CreditCardView;

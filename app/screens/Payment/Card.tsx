import {
  CreditCardView,
  CreditCardInput,
  type CreditCardFormData,
  type CreditCardFormField,
  type ValidationState,
} from '@/components/card';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { useWompiStore } from '@/app/utils/wompiStore';
import url from "@/constants/url.json";
import {
  KeyboardAvoidingView,
Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from "@/constants/theme/useTheme";
import ProgressStepsBar from "@/components/progressIndicators/progressStepsBar";
const getStyles = (theme, width, height) => StyleSheet.create({
  container: {
    height: height,
    backgroundColor: theme.colors.background,
  },
  content: {
   
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  cardView: {
    alignSelf: 'center',
    
  },
  cardInput: {
    marginTop: 20,
  },
  button: {

    alignItems: 'center',
    justifyContent: 'center',
    height: "9%",
    marginTop: "10%",
    width: '100%',
  },
  button2: {
 position: 'absolute',
    bottom: "5%",
    height: "7%",

    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
   
    fontSize: 18,
    fontWeight: "200",
  },
  card1: {
    padding: 15,
    borderRadius: 14,
    elevation: 7,
    shadowOffset: { width: 4, height: -4 },
    shadowColor: "#616161",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: "100%",
    position: "absolute",
    bottom: 0,
  
    marginVertical: 0,
    marginBottom: height * 0.07,
  },
  shippingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  fee: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 15,
    zIndex: -1,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  label: {
    fontSize: 14,
    fontWeight: "400",
    zIndex: -1,
  },
  button3: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    width: "100%",
  },
});

const toStatusIcon = (status?: ValidationState) =>
  status === 'valid' ? '✅' : status === 'invalid' ? '❌' : '❓';

export default function Example() {
  const { eventId, price, eventName, quantity } = useLocalSearchParams();
  
  const { wompiData } = useWompiStore();

  const { width, height } = useWindowDimensions();
  const theme = useAppTheme();
  const s = getStyles(theme, width, height);
  const [focusedField, setFocusedField] = useState<CreditCardFormField>();
  const [formData, setFormData] = useState<CreditCardFormData>();
//   const handleNext = async () => {
//     console.log("eventId type:", typeof eventId);
// console.log("eventId value:", eventId);
//     try {
//       console.log(wompiData.public_key);
//       console.log(price);
  
//       const tokenResponse = await tokenCard(); // Esperamos la respuesta
  
//       if (tokenResponse != null) {
        
//         const paymentMethodToken = tokenResponse.id; // Ajusta esto según tu respuesta real
  
//         await createTransaction({
//           amount_in_cents: price * 100, 
//           eventId: eventId,
//           quantity: quantity,
//           customer_email: "usuario@example.com",
//           payment_method_token: paymentMethodToken,
//           acceptance_token: wompiData?.presigned_acceptance.acceptance_token,
//         });
  
//       } else {
//         console.error("Error al generar el token de tarjeta:", tokenResponse);
//         Alert.alert("Error", "No se pudo generar el token de la tarjeta.");
//       }
  
//     } catch (error) {
//       console.error("Error en handleNext:", error);
//       Alert.alert("Error", "Ocurrió un error al procesar el pago.");
//     }
//   };
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const onKeyboardShow = (e: KeyboardEvent) => {
      setTimeout(() => {
        const height = Platform.OS === 'ios' ? e.endCoordinates.height : e.endCoordinates.screenY;
        setKeyboardHeight(height);
      }, 50);

    };
  
    const onKeyboardHide = () => {
      setKeyboardHeight(0);
    };
  
    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardHide);
  
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const tokenCard = async () => {
    try {
      const response = await fetch("https://sandbox.wompi.co/v1/tokens/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${wompiData?.public_key}`, // Asegúrate que `public_key` sea válido y esté presente
        },
        body: JSON.stringify({
          number: formData?.values?.number?.replace(/\s+/g, ""), // Limpia espacios
          cvc: formData?.values?.cvc,
          exp_month: formData?.values?.expMonth || "08",
          exp_year: formData?.values?.expYear || "28",
          card_holder: formData?.values?.name,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("✅ Token generado:", result.data.id);
        return result.data;
      } else {
        console.warn("❌ Error al tokenizar:", result);
        alert("Error al tokenizar:\n" + JSON.stringify(result.error?.messages, null, 2));
        return null;
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
      alert("No se pudo conectar con Wompi.");
      return null;
    }
  };
  
  type CreateTransactionInput = {
    amount_in_cents: number;
    quantity: number;
    eventId: string;
    customer_email: string;
    payment_method_token: string;
    acceptance_token: string;
   
  };
  const createTransaction = async (data: CreateTransactionInput) => {
    console.log("Datos de la transacción:", data);
    try {
      const response = await fetch(`${url.url}/create-transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount_in_cents: data.amount_in_cents,
          eventId: eventId, 
          quantity: quantity,
          customer_email: data.customer_email,
          payment_method: {
            token: data.payment_method_token,
          },
          acceptance_token: data.acceptance_token,
       
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error de backend:", result);
        throw new Error(result.error || "Error al crear la transacción");
      }

      console.log("Transacción exitosa:", result);
      Alert.alert("Éxito", "La transacción fue creada correctamente.");
    } catch (error: any) {
      console.error("Error creando transacción:", error);
      Alert.alert("Error", error.message || "Error al crear la transacción.");
    }
  };


  return (
    <SafeAreaView edges={['top']} style={s.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.container}
      >
 
          <CreditCardView
            focusedField={focusedField}
            type={formData?.values.type}
            number={formData?.values.number}
            name={formData?.values.name}
            expiry={formData?.values.expiry}
            cvc={formData?.values.cvc}
            style={s.cardView}
            imageFront={require("@/assets/images/card-front.png")}
          />

          <CreditCardInput
            autoFocus
            style={s.cardInput}
            onChange={setFormData}
            onFocusField={setFocusedField}
          />
 {keyboardHeight > 0 && (
    <TouchableOpacity
      onPress={handleNext}
      style={[s.button, { backgroundColor: theme.colors.primary ,marginBottom: keyboardHeight }]}
    >
      <Text style={[s.buttonText,{ color: "#ffff" }]}>Confirmar compra</Text>
    </TouchableOpacity>
  )}
     </KeyboardAvoidingView>

{/* Botón fijo al fondo (cuando el teclado está oculto) */}
{keyboardHeight === 0 && (
     <View style={[s.card1, { backgroundColor: theme.colors.card }]}>
          <View style={s.stepContainer}>
            <ProgressStepsBar totalSteps={3} currentStep={3} />
          </View>
  
          <View style={s.totalRow}>
            <Text style={[s.totalLabel, { color: theme.colors.text }]}>
              Total
            </Text>
            <Text style={[s.totalValue, { color: theme.colors.text }]}>
            $ {price}
            </Text>
          </View>
  
          <TouchableOpacity
            onPress={() => {
              handleNext();
            }}
            style={[s.button3, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={[s.buttonText, { color: "#ffff" }]}>
             Confirmar compra
            </Text>
          </TouchableOpacity>
        </View>
     
  )}
 
    </SafeAreaView>
  );
}
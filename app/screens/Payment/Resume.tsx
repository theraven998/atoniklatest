import React, {useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { formatDateColombia } from '@/app/utils/date/formatDate';
import { useAppTheme } from '@/constants/theme/useTheme';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';
import {getEventById} from "@/app/utils/api/event";
import { useLocalSearchParams } from "expo-router";
import ProgressStepsBar from '@/components/progressIndicators/progressStepsBar';
export default function CarritoEntradas() {
  const { eventId } = useLocalSearchParams();

  
  const [event, setEvent] = useState<any>(null);
  const router = useRouter();
  const handleNext = () => {
    console.log("eventId type:", typeof eventId);
console.log("eventId value:", eventId);
    router.push({
      pathname: '/screens/Payment/Select',
      params: {
        eventId: eventId,
        eventName: event?.name,
        price: total,
        quantity:quantity,
      },
    });
  };
  
  
  const theme = useAppTheme();

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }))
  );

  const [coupon, setCoupon] = useState('');
  const ticketPrice = event?.price ?? 0; // Usa el operador nullish coalescing (??) para valores null/undefined
  const serviceFee = event?.service_fee ?? 0; // Asegura que sea 0 si no está definido
  
  const total = useMemo(() => {
    return (ticketPrice * quantity + serviceFee * quantity).toLocaleString('es-CO');
  }, [quantity, ticketPrice, serviceFee]); // Asegúrate de que use los valores dependientes de 'ticketPrice' y 'serviceFee'
  
  const totalEntradas = useMemo(() => {
    return (ticketPrice * quantity).toLocaleString('es-CO');
  }, [quantity, ticketPrice]); // Igual que el anterior, incluye las dependencias correctas
  
  const totalFee = useMemo(() => {
    return (serviceFee* quantity).toLocaleString('es-CO');
  }, [quantity, ticketPrice]); // Igual que el anterior, incluye las dependencias correctas
  

  useEffect(() => {
    console.log("eventId:", eventId); 
    if (!eventId) return;

    const fetchEvent = async () => {
      const result = await getEventById(eventId as string);
      setEvent(result);
      console.log("Event data:", result); // Verifica que los datos se obtengan correctamente
    };

    fetchEvent();
  }, [eventId]);


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Resumen</Text>

        <View style={[styles.card, { backgroundColor: theme.colors.card, flexDirection: 'row' }]}>
          <Image
            source={{ uri: event?.image }}
            style={styles.image}
          />
          <View style={styles.details}>
            <Text style={[styles.eventTitle, { color: theme.colors.text }]}>{event?.service_fee }</Text>
            <Text style={[styles.date, { color: theme.colors.secondary }]}>    {event?.date?.$date ? formatDateColombia(event.date.$date) : 'Cargando fecha...'}</Text>

            <Text style={[styles.label, { color: theme.colors.text, marginTop: 5 }]}>Cantidad:</Text>
            <DropDownPicker
              open={open}
              value={quantity}
              items={items}
              setOpen={setOpen}
              setValue={setQuantity}
              setItems={setItems}
              containerStyle={{ marginTop: 5, zIndex: 99 }}
              style={{ borderColor: theme.colors.border }}
              dropDownContainerStyle={{ zIndex: 99, borderColor: theme.colors.border }}
              textStyle={{ color: theme.colors.text }}
              theme={theme.mode === 'dark' ? 'DARK' : 'LIGHT'}
            />

            <Text style={[styles.price, { color: theme.colors.text }]}>$ {ticketPrice.toLocaleString('es-CO')} c/u</Text>
          </View>
        </View>

        <View style={styles.line} />
        <Text style={[styles.label, {marginLeft:4, marginBottom:1,color: theme.colors.text }]}>Código de promotor</Text>
        <TextInput
          placeholder="Código promocional"
          placeholderTextColor={"#766b80"}
          value={coupon}
          onChangeText={setCoupon}
          style={[styles.input, { marginTop:5,borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.input }]}
        />

    
      </ScrollView>

      <View style={[styles.card1, { backgroundColor: theme.colors.card,  }]}>
      <View style={styles.stepContainer}>
            <ProgressStepsBar totalSteps={3} currentStep={1} />
          </View>
      <View style={styles.shippingRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Entradas</Text>
          <Text style={[styles.fee, { color: theme.colors.text }]}>$ {totalEntradas}</Text>
        </View>
        <View style={styles.shippingRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Tarifa de servicio</Text>
          <Text style={[styles.fee, { color: theme.colors.text }]}>$ {totalFee}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.colors.text }]}>$ {total}</Text>
        </View>

        <TouchableOpacity onPress={()=>{handleNext()}} style={[styles.button, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.buttonText, { color: "#ffff"}]}>Continuar compra</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 10,
  },
  card: {
    padding: 15,
    borderRadius: 14,
    elevation: 5,
    shadowColor: '#000',
    
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
  },  card1: {
    padding: 15,
    borderRadius: 14,
    elevation: 7,
    shadowOffset: { width: 4, height: -4 },
    shadowColor: '#616161',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: '100%',
    marginVertical:15 ,

  },
  image: {
    width: 80,
    height: 120,
    marginRight: 15,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  date: {
    fontSize: 13,
    fontWeight: '300',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    zIndex:-1
  },
  price: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 10,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
    zIndex:-1,
  },
  shippingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fee: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 15,
    zIndex:-1,

  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  button: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
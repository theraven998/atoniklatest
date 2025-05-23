import { format, toZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';

const capitalizeFirstLetter = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const formatDateColombia = (isoInput: any): string => {
  try {
    console.log('ISO String:', isoInput);

    // Extraer "$date" si es necesario
    const isoString =
      typeof isoInput === 'object' && '$date' in isoInput
        ? isoInput.$date
        : isoInput;

    if (!isoString || isNaN(Date.parse(isoString))) {
      return 'Fecha inválida';
    }

    const timeZone = 'America/Bogota';
    const zonedDate = toZonedTime(isoString, timeZone);

    const formatted = format(zonedDate, "EEEE - d MMM yyyy, h:mm a", {
      locale: es,
    });

    return capitalizeFirstLetter(formatted);
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
};

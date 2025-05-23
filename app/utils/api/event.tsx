import url from "@/constants/url.json"

export const getEventById = async (eventId: string): Promise<any> => {
    try {
      const response = await fetch(`${url.url}/api/event/${eventId}`);
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const event = await response.json();
      return event;
  
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  };
  
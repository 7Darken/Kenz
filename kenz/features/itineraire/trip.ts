/**
 * Lectures d'un itinéraire (sans données : client et serveur s'en servent, sans embarquer content/itineraries).
 */
import type { Itinerary, ItineraryCity } from "@/content/itineraries";

/** Les jours consécutifs d'une même ville, dans l'ordre du voyage (jours comptés à partir de 1, bornes incluses). */
export interface CityStop {
  city: ItineraryCity;
  firstDay: number;
  lastDay: number;
}

export function cityOf(itinerary: Itinerary, id: string): ItineraryCity {
  const city = itinerary.cities.find((c) => c.id === id);
  if (!city) throw new Error(`Ville inconnue « ${id} » dans l’itinéraire « ${itinerary.slug} »`);
  return city;
}

export function cityStops(itinerary: Itinerary): CityStop[] {
  const stops: CityStop[] = [];
  itinerary.days.forEach((day, index) => {
    const last = stops.at(-1);
    if (last && last.city.id === day.city) last.lastDay = index + 1;
    else stops.push({ city: cityOf(itinerary, day.city), firstDay: index + 1, lastDay: index + 1 });
  });
  return stops;
}

export function tripStats(itinerary: Itinerary) {
  return {
    days: itinerary.days.length,
    cities: itinerary.cities.length,
    activities: itinerary.days.reduce((sum, day) => sum + day.activities.length, 0),
    budgetMin: itinerary.days.reduce((sum, day) => sum + day.budgetEur.min, 0),
    budgetMax: itinerary.days.reduce((sum, day) => sum + day.budgetEur.max, 0),
  };
}

/** Les adresses YouTube de la vidéo : la page, et le lecteur sans cookies (chargé seulement à la demande). */
export function videoUrls(itinerary: Itinerary) {
  return {
    watch: `https://www.youtube.com/watch?v=${itinerary.youtubeVideoId}`,
    embed: `https://www.youtube-nocookie.com/embed/${itinerary.youtubeVideoId}?autoplay=1&rel=0`,
  };
}

/** S'abonner à la chaîne : YouTube ouvre directement sa fenêtre « S'abonner ? ». */
export const subscribeUrl = (channel: string) => `${channel}?sub_confirmation=1`;

/** Le nom de la chaîne dans son adresse : « @7Kinze ». */
export const channelHandle = (channel: string) => new URL(channel).pathname.slice(1);

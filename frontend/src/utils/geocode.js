export const geocodePlace = async (query) => {
  if (!query) return null;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  );

  const data = await res.json();

  if (!data || data.length === 0) return null;

  return {
    name: data[0].display_name,
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
};

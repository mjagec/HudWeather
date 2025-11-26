export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon are required' });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENWEATHER_API_KEY is not configured on the server' });
  }

  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;
 
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Log non-2xx responses to help debug issues like missing subscription/limits.
    if (!response.ok) {
      console.error('OpenWeather forecast API returned non-OK status', {
        status: response.status,
        statusText: response.statusText,
        body: data,
      });
    }

    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Error calling OpenWeather forecast API', err);
    return res.status(500).json({ error: 'Failed to fetch forecast' });
  }
}

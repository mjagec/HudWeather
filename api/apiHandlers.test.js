import weatherHandler from './weather';
import forecastHandler from './forecast';

// These tests are written with Jest-style APIs (describe/test/expect/jest.fn).
// Configure your test runner (e.g. Jest or Vitest in Jest-compat mode) to pick up this file.

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('/api/weather handler', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  test('returns 400 when lat or lon are missing', async () => {
    const req = { query: { lat: '57.44' } }; // missing lon
    const res = createMockRes();

    await weatherHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'lat and lon are required' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('returns 500 when OPENWEATHER_API_KEY is not configured', async () => {
    const req = { query: { lat: '57.44', lon: '-2.78' } };
    const res = createMockRes();

    delete process.env.OPENWEATHER_API_KEY;

    await weatherHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'OPENWEATHER_API_KEY is not configured on the server' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('successfully fetches and returns weather data for valid coordinates', async () => {
    const req = { query: { lat: '57.44', lon: '-2.78' } };
    const res = createMockRes();
    const mockData = { weather: [{ main: 'Clouds' }] };

    process.env.OPENWEATHER_API_KEY = 'test-api-key';

    const jsonSpy = jest.fn().mockResolvedValue(mockData);
    global.fetch.mockResolvedValue({
      status: 200,
      json: jsonSpy,
    });

    await weatherHandler(req, res);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [calledUrl] = global.fetch.mock.calls[0];
    expect(calledUrl).toContain('lat=57.44');
    expect(calledUrl).toContain('lon=-2.78');
    expect(calledUrl).toContain('appid=test-api-key');

    expect(jsonSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });
});

describe('/api/forecast handler', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  test('returns 400 when lat or lon are missing', async () => {
    const req = { query: { lon: '-1.7842' } }; // missing lat
    const res = createMockRes();

    await forecastHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'lat and lon are required' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('successfully fetches and returns forecast data for valid coordinates', async () => {
    const req = { query: { lat: '53.649', lon: '-1.7842' } };
    const res = createMockRes();
    const mockData = { daily: [{ temp: { day: 10 } }] };

    process.env.OPENWEATHER_API_KEY = 'test-api-key';

    const jsonSpy = jest.fn().mockResolvedValue(mockData);
    global.fetch.mockResolvedValue({
      status: 200,
      json: jsonSpy,
    });

    await forecastHandler(req, res);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [calledUrl] = global.fetch.mock.calls[0];
    expect(calledUrl).toContain('lat=53.649');
    expect(calledUrl).toContain('lon=-1.7842');
    expect(calledUrl).toContain('appid=test-api-key');

    expect(jsonSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });
});

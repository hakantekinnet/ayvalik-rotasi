import { NextResponse } from "next/server";

interface WeatherData {
  temp: number;
  seaTemp: number;
  windSpeed: number;
  windDirection: string;
  windDirectionLocal: string;
  sunset: string;
  recommendation: string;
  goodBeaches: string[];
  badBeaches: string[];
}

// Map wind degree to Turkish wind name and beach recommendations
function getWindInfo(deg: number): {
  direction: string;
  local: string;
  goodBeaches: string[];
  badBeaches: string[];
  recommendation: string;
} {
  if (deg >= 337.5 || deg < 22.5) {
    return {
      direction: "Kuzey",
      local: "Poyraz",
      goodBeaches: ["Badavut Plajı", "Sarımsaklı Merkez", "Küçükköy Sahili"],
      badBeaches: ["Patriça Koyu", "Ortunç Koyu", "Cunda Arka Deniz"],
      recommendation: "Badavut veya Sarımsaklı ideal!",
    };
  }
  if (deg >= 22.5 && deg < 67.5) {
    return {
      direction: "Kuzeydoğu",
      local: "Poyraz",
      goodBeaches: ["Sarımsaklı Plajı", "Badavut Plajı"],
      badBeaches: ["Cunda Sahili", "Patriça Koyu"],
      recommendation: "Sarımsaklı veya Badavut'a yönelin.",
    };
  }
  if (deg >= 67.5 && deg < 112.5) {
    return {
      direction: "Doğu",
      local: "Keşişleme",
      goodBeaches: ["Cunda Sahili", "Patriça Koyu"],
      badBeaches: ["Sarımsaklı Plajı", "Badavut Plajı"],
      recommendation: "Cunda tarafı bugün sakin.",
    };
  }
  if (deg >= 112.5 && deg < 157.5) {
    return {
      direction: "Güneydoğu",
      local: "Kıble",
      goodBeaches: ["Ortunç Koyu", "Cunda Arka Deniz"],
      badBeaches: ["Küçükköy Sahili", "Badavut Plajı"],
      recommendation: "Ortunç ve Cunda Arka ideal.",
    };
  }
  if (deg >= 157.5 && deg < 202.5) {
    return {
      direction: "Güney",
      local: "Lodos",
      goodBeaches: ["Küçükköy Sahili", "Badavut Plajı"],
      badBeaches: ["Sarımsaklı Plajı", "Ortunç Koyu"],
      recommendation: "Kuzey kıyıları sakin kalır.",
    };
  }
  if (deg >= 202.5 && deg < 247.5) {
    return {
      direction: "Güneybatı",
      local: "Lodos",
      goodBeaches: ["Patriça Koyu", "Cunda Sahili"],
      badBeaches: ["Badavut Plajı", "Küçükköy Sahili"],
      recommendation: "Doğu kıyıları korunaklı.",
    };
  }
  if (deg >= 247.5 && deg < 292.5) {
    return {
      direction: "Batı",
      local: "Karayel",
      goodBeaches: ["Cunda Arka Deniz", "Ortunç Koyu"],
      badBeaches: ["Sarımsaklı Plajı", "Badavut Plajı"],
      recommendation: "İç koylar bugün rahat.",
    };
  }
  // 292.5 - 337.5: Kuzeybatı
  return {
    direction: "Kuzeybatı",
    local: "Karayel",
    goodBeaches: ["Badavut Plajı", "Küçükköy Sahili"],
    badBeaches: ["Cunda Sahili", "Patriça Koyu"],
    recommendation: "Güney kıyıları sakin!",
  };
}

// Format unix timestamp to HH:MM
function formatSunset(unixTimestamp: number, timezoneOffset: number): string {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Fallback data when no API key is set
const FALLBACK_DATA: WeatherData = {
  temp: 28,
  seaTemp: 22,
  windSpeed: 18,
  windDirection: "Kuzey",
  windDirectionLocal: "Poyraz",
  sunset: "20:34",
  recommendation: "Badavut veya Sarımsaklı ideal!",
  goodBeaches: ["Badavut Plajı", "Sarımsaklı Merkez", "Küçükköy Sahili"],
  badBeaches: ["Patriça Koyu", "Ortunç Koyu", "Cunda Arka Deniz"],
};

export async function GET(): Promise<NextResponse<WeatherData>> {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(FALLBACK_DATA);
  }

  try {
    // Ayvalık coordinates
    const lat = 39.3193;
    const lon = 26.6961;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
      { next: { revalidate: 1800 } } // Cache for 30 minutes
    );

    if (!res.ok) {
      console.error("Weather API error:", res.status);
      return NextResponse.json(FALLBACK_DATA);
    }

    const data = await res.json();

    const windDeg = data.wind?.deg ?? 0;
    const windInfo = getWindInfo(windDeg);
    const windSpeedKmh = Math.round((data.wind?.speed ?? 0) * 3.6);

    const weatherData: WeatherData = {
      temp: Math.round(data.main?.temp ?? 28),
      seaTemp: Math.round((data.main?.temp ?? 28) - 6), // Approximate sea temp
      windSpeed: windSpeedKmh,
      windDirection: windInfo.direction,
      windDirectionLocal: windInfo.local,
      sunset: data.sys?.sunset
        ? formatSunset(data.sys.sunset, data.timezone ?? 10800)
        : "20:34",
      recommendation: windInfo.recommendation,
      goodBeaches: windInfo.goodBeaches,
      badBeaches: windInfo.badBeaches,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Weather fetch error:", error);
    return NextResponse.json(FALLBACK_DATA);
  }
}

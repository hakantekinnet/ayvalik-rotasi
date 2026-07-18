import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API Key eksik" }, { status: 500 });
  }

  try {
    // Fetch live weather for Ayvalık (Lat: 39.3193, Lon: 26.6961)
    // Revalidate every 1800 seconds (30 minutes) to save API calls
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=39.3193&lon=26.6961&appid=${apiKey}&units=metric&lang=tr`,
      { next: { revalidate: 1800 } }
    );

    const data = await res.json();

    // Convert wind speed from m/s to km/h
    const windSpeedKmH = Math.round(data.wind.speed * 3.6);
    const windDeg = data.wind.deg;

    // Default to Poyraz (North) logic
    let windDirection = "Kuzey (Poyraz)";
    let recommendation = "Badavut veya Sarımsaklı ideal!";
    let goodBeaches = ["Badavut Plajı", "Sarımsaklı Merkez", "Küçükköy Sahili"];
    let badBeaches = ["Patriça Koyu", "Ortunç Koyu", "Cunda Arka Deniz"];

    // Basic wind direction logic: If wind is coming from the South (Lodos)
    if (windDeg > 135 && windDeg < 225) {
      windDirection = "Güney (Lodos)";
      recommendation = "Kuzey koyları ve Cunda arka deniz daha sakin olur.";
      goodBeaches = ["Ortunç Koyu", "Patriça Koyu", "Cunda Arka Deniz"];
      badBeaches = ["Sarımsaklı Merkez", "Badavut Plajı"];
    } else if (windDeg > 225 && windDeg < 315) {
      windDirection = "Batı (Günbatısı)";
    } else if (windDeg > 45 && windDeg <= 135) {
      windDirection = "Doğu (Keşişleme)";
    }

    // Calculate sunset time in local timezone
    const sunsetDate = new Date((data.sys.sunset + data.timezone) * 1000);
    const sunset = `${sunsetDate.getUTCHours().toString().padStart(2, "0")}:${sunsetDate.getUTCMinutes().toString().padStart(2, "0")}`;

    return NextResponse.json({
      temp: Math.round(data.main.temp),
      seaTemp: Math.round(data.main.temp) - 6, // Fallback estimation for sea temp
      windSpeed: windSpeedKmH,
      windDirection,
      windDirectionLocal: windDirection.match(/\(([^)]+)\)/)?.[1] ?? "Poyraz",
      sunset,
      recommendation,
      goodBeaches,
      badBeaches,
    });
  } catch (error) {
    console.error("Hava durumu API hatası:", error);
    return NextResponse.json(
      { error: "Hava durumu çekilemedi" },
      { status: 500 }
    );
  }
}

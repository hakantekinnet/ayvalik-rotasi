import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Adding (req: Request) is the magic key that forces Next.js to run this on every single request, preventing static generation at build time.
export async function GET(req: Request) {
  const apiKey = process.env.WEATHER_API_KEY;
  
  const fallbackData = {
    temp: 28,
    seaTemp: 22,
    windSpeed: 18,
    windDirection: "Kuzey (Poyraz)",
    recommendation: "Badavut veya Sarımsaklı ideal!",
    goodBeaches: ["Badavut Plajı", "Sarımsaklı Merkez", "Küçükköy Sahili"],
    badBeaches: ["Patriça Koyu", "Ortunç Koyu", "Cunda Arka Deniz"]
  };

  console.log("============== HAVA DURUMU CANLI TETİKLENDİ ==============");
  console.log("1. API Key durumu:", apiKey ? "OKUNDU" : "EKSİK");

  if (!apiKey) {
    return NextResponse.json(fallbackData);
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=39.3193&lon=26.6961&appid=${apiKey}&units=metric&lang=tr`,
      { cache: 'no-store' }
    );
    
    const data = await res.json();
    console.log("2. OpenWeather COD Yanıtı:", data.cod);

    if (data.cod !== 200 || !data.main || !data.wind) {
      return NextResponse.json(fallbackData);
    }

    const windSpeedKmH = Math.round(data.wind.speed * 3.6);
    const windDeg = data.wind.deg;

    let windDirection = "Kuzey (Poyraz)";
    let recommendation = "Badavut veya Sarımsaklı ideal!";
    let goodBeaches = ["Badavut Plajı", "Sarımsaklı Merkez", "Küçükköy Sahili"];
    let badBeaches = ["Patriça Koyu", "Ortunç Koyu", "Cunda Arka Deniz"];

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

    return NextResponse.json({
      temp: Math.round(data.main.temp),
      seaTemp: Math.round(data.main.temp) - 6,
      windSpeed: windSpeedKmH,
      windDirection,
      recommendation,
      goodBeaches,
      badBeaches
    });
  } catch (error) {
    console.error("3. SUNUCU HATASI:", error);
    return NextResponse.json(fallbackData);
  }
}

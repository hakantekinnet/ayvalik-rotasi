import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
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

  // DEBUG LOG 1: Vercel ortam değişkenini görebiliyor mu?
  console.log("============== HAVA DURUMU API TESTİ ==============");
  console.log("1. API Key Vercel'de okunuyor mu?:", apiKey ? "EVET, OKUNDU" : "HAYIR, EKSİK (undefined)");

  if (!apiKey) {
    console.log("HATA: API Key bulunamadığı için yedek veri gönderiliyor.");
    return NextResponse.json(fallbackData);
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=39.3193&lon=26.6961&appid=${apiKey}&units=metric&lang=tr`,
      { cache: 'no-store' }
    );
    
    const data = await res.json();
    
    // DEBUG LOG 2: OpenWeatherMap tam olarak ne cevap veriyor?
    console.log("2. OpenWeatherMap Yanıtı (COD):", data.cod);

    if (data.cod !== 200 || !data.main || !data.wind) {
      console.warn("3. HATA: API geçersiz yanıt döndü. Tam yanıt:", JSON.stringify(data));
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

    console.log("BAŞARILI: Canlı veri başarıyla arayüze gönderildi.");
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
    console.error("SUNUCU HATASI:", error);
    return NextResponse.json(fallbackData);
  }
}

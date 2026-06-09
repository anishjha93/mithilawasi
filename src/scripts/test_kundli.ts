import { Observer, SiderealTime, Ecliptic, GeoVector, EclipticGeoMoon, Body, SunPosition, MakeTime } from 'astronomy-engine';

// Test location: Darbhanga (26.15 N, 85.90 E)
// Test birth time: 2026-06-04T08:00:00Z (which is 1:30 PM IST)
const date = new Date('2026-06-04T08:00:00Z');
const latitude = 26.15;
const longitude = 85.90;

const rashisEn = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];

function getSiderealLagna(date: Date, latitude: number, longitude: number): number {
    const time = MakeTime(date);
    const gmst = SiderealTime(date); // GAST in hours
    const lst = (gmst + longitude / 15.0 + 24.0) % 24.0; // Local Sidereal Time in hours
    const lstRad = lst * (15.0 * Math.PI / 180.0);
    
    // Calculate obliquity of the ecliptic
    // e_tilt(time).tt is the true obliquity in degrees
    const obliquity = 23.4392911; // approximate for J2000
    const obliquityRad = obliquity * Math.PI / 180.0;
    const latRad = latitude * Math.PI / 180.0;
    
    const y = Math.cos(lstRad);
    const x = - (Math.sin(lstRad) * Math.cos(obliquityRad) + Math.tan(latRad) * Math.sin(obliquityRad));
    
    let ascendant = Math.atan2(y, x) * 180.0 / Math.PI;
    ascendant = (ascendant + 360) % 360;
    
    // Sidereal correction (Lahiri Ayanamsha)
    // Ayanamsha for 2026 is approx 24.16
    const ayanamsha = 23.85 + (date.getFullYear() - 2000) * 0.013969;
    return (ascendant - ayanamsha + 360) % 360;
}

function getPlanetSiderealLongitude(body: Body, date: Date): number {
    let tropicalLong = 0;
    if (body === Body.Moon) {
        tropicalLong = EclipticGeoMoon(date).lon;
    } else if (body === Body.Sun) {
        tropicalLong = SunPosition(date).elon;
    } else {
        const vector = GeoVector(body, date, true);
        const ecliptic = Ecliptic(vector);
        tropicalLong = ecliptic.elon;
    }
    
    const ayanamsha = 23.85 + (date.getFullYear() - 2000) * 0.013969;
    return (tropicalLong - ayanamsha + 360) % 360;
}

function getRahuKetu(date: Date): { rahu: number; ketu: number } {
    // Mean Rahu longitude calculation
    const ms = date.getTime() - new Date('2000-01-01T12:00:00Z').getTime();
    const days = ms / (1000 * 60 * 60 * 24);
    const T = days / 36525.0;
    
    let rahu = 125.044522 - 1934.136261 * T + 0.002078 * T * T;
    rahu = (rahu % 360 + 360) % 360;
    const ketu = (rahu + 180) % 360;
    
    const ayanamsha = 23.85 + (date.getFullYear() - 2000) * 0.013969;
    return {
        rahu: (rahu - ayanamsha + 360) % 360,
        ketu: (ketu - ayanamsha + 360) % 360
    };
}

try {
    const lagnaLon = getSiderealLagna(date, latitude, longitude);
    const lagnaRashiIndex = Math.floor(lagnaLon / 30);
    const lagnaRashiNum = lagnaRashiIndex + 1;
    
    console.log(`Lagna Longitude: ${lagnaLon.toFixed(2)}° (${rashisEn[lagnaRashiIndex]}) - Rashi Num: ${lagnaRashiNum}`);
    
    const planets = [
        { name: 'Sun', body: Body.Sun },
        { name: 'Moon', body: Body.Moon },
        { name: 'Mercury', body: Body.Mercury },
        { name: 'Venus', body: Body.Venus },
        { name: 'Mars', body: Body.Mars },
        { name: 'Jupiter', body: Body.Jupiter },
        { name: 'Saturn', body: Body.Saturn }
    ];
    
    const planetPlacements: Record<string, number> = {};
    
    for (const p of planets) {
        const lon = getPlanetSiderealLongitude(p.body, date);
        const rashiIndex = Math.floor(lon / 30);
        const rashiNum = rashiIndex + 1;
        const houseNum = ((rashiNum - lagnaRashiNum + 12) % 12) + 1;
        console.log(`${p.name} Sidereal Longitude: ${lon.toFixed(2)}° (${rashisEn[rashiIndex]}) - House: ${houseNum}`);
        planetPlacements[p.name] = houseNum;
    }
    
    const { rahu, ketu } = getRahuKetu(date);
    const rahuRashiNum = Math.floor(rahu / 30) + 1;
    const rahuHouse = ((rahuRashiNum - lagnaRashiNum + 12) % 12) + 1;
    console.log(`Rahu Sidereal Longitude: ${rahu.toFixed(2)}° - House: ${rahuHouse}`);
    
    const ketuRashiNum = Math.floor(ketu / 30) + 1;
    const ketuHouse = ((ketuRashiNum - lagnaRashiNum + 12) % 12) + 1;
    console.log(`Ketu Sidereal Longitude: ${ketu.toFixed(2)}° - House: ${ketuHouse}`);

} catch (err) {
    console.error("Error calculating Kundli:", err);
}

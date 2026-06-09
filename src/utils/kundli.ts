import { Observer, SiderealTime, Ecliptic, GeoVector, EclipticGeoMoon, Body, SunPosition } from 'astronomy-engine';

export interface PlanetData {
    name: string;      // English ID
    longitude: number; // 0 to 360
    degreeStr: string; // e.g. "19° 31'"
    rashiIndex: number; // 0 to 11
    houseNum: number;  // 1 to 12
}

export interface KundliResult {
    lagnaLongitude: number;
    lagnaRashiIndex: number;
    planets: PlanetData[];
}

// Obliquity of the Ecliptic (approx J2000)
const OBLIQUITY_RAD = 23.4392911 * Math.PI / 180.0;

/**
 * Calculates the Sidereal Ascendant (Lagna) ecliptic longitude.
 */
export function calculateSiderealLagna(date: Date, latitude: number, longitude: number, ayanamsha: number): number {
    const gmst = SiderealTime(date); // Greenwich Apparent Sidereal Time in hours
    const lst = (gmst + longitude / 15.0 + 24.0) % 24.0; // Local Sidereal Time in hours
    const lstRad = lst * (15.0 * Math.PI / 180.0);
    const latRad = latitude * Math.PI / 180.0;

    const y = Math.cos(lstRad);
    const x = - (Math.sin(lstRad) * Math.cos(OBLIQUITY_RAD) + Math.tan(latRad) * Math.sin(OBLIQUITY_RAD));

    let ascendant = Math.atan2(y, x) * 180.0 / Math.PI;
    ascendant = (ascendant + 360) % 360;

    // Apply Lahiri Ayanamsha correction for Sidereal coordinates
    return (ascendant - ayanamsha + 360) % 360;
}

/**
 * Calculates Lahiri Ayanamsha for a given year.
 */
export function getAyanamsha(year: number): number {
    // Standard Lahiri Ayanamsha approximation: 23.85 degrees in 2000, shifting by ~50.29 arcseconds per year
    return 23.85 + (year - 2000) * 0.013969;
}

/**
 * Formats longitude degrees into Degree/Minute string (e.g. 19.52 degrees -> 19° 31')
 */
export function formatDegrees(lon: number): string {
    const rashiDeg = lon % 30;
    const deg = Math.floor(rashiDeg);
    const min = Math.floor((rashiDeg - deg) * 60);
    return `${deg}° ${String(min).padStart(2, '0')}'`;
}

/**
 * Calculates geocentric longitude for a given body.
 */
export function getPlanetLongitude(body: Body, date: Date): number {
    if (body === Body.Moon) {
        return EclipticGeoMoon(date).lon;
    }
    if (body === Body.Sun) {
        return SunPosition(date).elon;
    }
    const vector = GeoVector(body, date, true);
    const ecliptic = Ecliptic(vector);
    return ecliptic.elon;
}

/**
 * Calculates Rahu and Ketu longitudes using Mean node J2000.0 epoch drift formula.
 */
export function getRahuKetuLongitudes(date: Date): { rahu: number; ketu: number } {
    const j2000Ms = new Date('2000-01-01T12:00:00Z').getTime();
    const ms = date.getTime() - j2000Ms;
    const days = ms / (1000 * 60 * 60 * 24);
    const T = days / 36525.0; // Julian centuries

    // Mean longitude of the ascending node
    let rahu = 125.044522 - 1934.136261 * T + 0.002078 * T * T;
    rahu = (rahu % 360 + 360) % 360;
    const ketu = (rahu + 180) % 360;

    return { rahu, ketu };
}

/**
 * Generates the complete Kundli positions and houses mapping.
 */
export function generateKundli(date: Date, latitude: number, longitude: number): KundliResult {
    const ayanamsha = getAyanamsha(date.getFullYear());
    const lagnaLon = calculateSiderealLagna(date, latitude, longitude, ayanamsha);
    const lagnaRashiIndex = Math.floor(lagnaLon / 30);
    const lagnaRashiNum = lagnaRashiIndex + 1;

    const planetsList = [
        { name: 'Sun', body: Body.Sun },
        { name: 'Moon', body: Body.Moon },
        { name: 'Mercury', body: Body.Mercury },
        { name: 'Venus', body: Body.Venus },
        { name: 'Mars', body: Body.Mars },
        { name: 'Jupiter', body: Body.Jupiter },
        { name: 'Saturn', body: Body.Saturn }
    ];

    const planets: PlanetData[] = [];

    // Calculate regular planets
    for (const p of planetsList) {
        const tropicalLon = getPlanetLongitude(p.body, date);
        const siderealLon = (tropicalLon - ayanamsha + 360) % 360;
        const rashiIndex = Math.floor(siderealLon / 30);
        const rashiNum = rashiIndex + 1;
        const houseNum = ((rashiNum - lagnaRashiNum + 12) % 12) + 1;

        planets.push({
            name: p.name,
            longitude: siderealLon,
            degreeStr: formatDegrees(siderealLon),
            rashiIndex,
            houseNum
        });
    }

    // Calculate Rahu & Ketu
    const meanNodes = getRahuKetuLongitudes(date);
    const siderealRahu = (meanNodes.rahu - ayanamsha + 360) % 360;
    const rahuRashiIndex = Math.floor(siderealRahu / 30);
    const rahuHouseNum = ((rahuRashiIndex + 1 - lagnaRashiNum + 12) % 12) + 1;

    planets.push({
        name: 'Rahu',
        longitude: siderealRahu,
        degreeStr: formatDegrees(siderealRahu),
        rashiIndex: rahuRashiIndex,
        houseNum: rahuHouseNum
    });

    const siderealKetu = (meanNodes.ketu - ayanamsha + 360) % 360;
    const ketuRashiIndex = Math.floor(siderealKetu / 30);
    const ketuHouseNum = ((ketuRashiIndex + 1 - lagnaRashiNum + 12) % 12) + 1;

    planets.push({
        name: 'Ketu',
        longitude: siderealKetu,
        degreeStr: formatDegrees(siderealKetu),
        rashiIndex: ketuRashiIndex,
        houseNum: ketuHouseNum
    });

    return {
        lagnaLongitude: lagnaLon,
        lagnaRashiIndex,
        planets
    };
}

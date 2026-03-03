import { useState, useEffect } from 'react';
import * as satellite from 'satellite.js';

export const useSatelliteLive = (line1, line2) => {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    if (!line1 || !line2) return;

    const satrec = satellite.twoline2satrec(line1, line2);

    const update = () => {
      const now = new Date();
      
      // 1. Propagate Satellite Physics
      const positionAndVelocity = satellite.propagate(satrec, now);
      const positionEci = positionAndVelocity.position;
      const velocityEci = positionAndVelocity.velocity;

      if (!positionEci || !velocityEci) return;

      // 2. Calculate Speed (km/h)
      const speedKmS = Math.sqrt(
        Math.pow(velocityEci.x, 2) + Math.pow(velocityEci.y, 2) + Math.pow(velocityEci.z, 2)
      );
      const speedKmH = speedKmS * 3600;

      // 3. Calculate Geodetic (Lat, Long, Height)
      const gmst = satellite.gstime(now);
      const positionGd = satellite.eciToGeodetic(positionEci, gmst);

      const longitude = satellite.degreesLong(positionGd.longitude);
      const latitude = satellite.degreesLat(positionGd.latitude);
      const heightKm = positionGd.height;

      setTelemetry({
        speed: speedKmH.toLocaleString('en-US', { maximumFractionDigits: 0 }) + " km/h",
        height: heightKm.toFixed(2) + " km",
        latitude: latitude.toFixed(4) + "°",
        longitude: longitude.toFixed(4) + "°",
        time: now.toUTCString().split(' ')[4] // Shows HH:MM:SS
      });
    };

    // Update every 100ms (10 times a second) for smooth numbers
    const interval = setInterval(update, 100);
    update(); // Run immediately

    return () => clearInterval(interval);
  }, [line1, line2]);

  return telemetry;
};
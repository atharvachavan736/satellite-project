import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// --- RESTORED LIVE PHYSICS HOOK ---
import { useSatelliteLive } from '../hooks/useSatelliteLive';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DetailedPanel = ({ data, isLoggedIn, tabRequest, onClose }) => {
  const [activeTab, setActiveTab] = useState('INFO');
  
  if (!data || !data.identity) return <div className="detailed-panel" style={{color:'white', padding:'20px'}}>Loading...</div>;

  const { identity, info_panel, tle_panel, tle, charts, ml_analytics } = data;

  // --- ACTIVATED LIVE DATA ---
  const liveData = useSatelliteLive(tle.line1, tle.line2);

  useEffect(() => {
    if (tabRequest) setActiveTab(tabRequest);
  }, [tabRequest]);

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { ticks: { color: '#888', font:{size:9} }, grid: { color: '#222' } } },
    elements: { point: { radius: 0 }, line: { borderWidth: 2 } }
  };
  
  const createDataset = (label, d, color) => ({
    labels: d ? Array.from({length: d.length}, (_, i) => i) : [],
    datasets: [{ label, data: d || [], borderColor: color, tension: 0.4 }]
  });

  return (
    <div className="detailed-panel">
      {/* HEADER */}
      <div className="panel-header">
        <div>
           <h2 className="panel-title" style={{fontSize: '16px', color: 'white'}}>
             {identity.name} <span style={{fontSize:'10px', color:'#3b82f6'}}>● LIVE</span>
           </h2>
        </div>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      {/* TABS */}
      <div className="tab-bar">
        <button onClick={() => setActiveTab('INFO')} className={`tab-btn ${activeTab === 'INFO' ? 'active' : ''}`}>INFO</button>
        <button onClick={() => setActiveTab('TLE')} className={`tab-btn ${activeTab === 'TLE' ? 'active' : ''}`}>TLE</button>
        <button onClick={() => setActiveTab('CHARTS')} className={`tab-btn ${activeTab === 'CHARTS' ? 'active' : ''}`}>CHARTS</button>
        
        {isLoggedIn && (
            <button onClick={() => setActiveTab('PREDICT')} className={`tab-btn ${activeTab === 'PREDICT' ? 'active' : ''}`} style={{color: '#c084fc', fontWeight: 'bold'}}>
                PREDICT
            </button>
        )}
      </div>

      <div className="scroll-area">
        
        {/* --- TAB 1: INFO --- */}
        {activeTab === 'INFO' && (
          <div>
            <div style={{width:'100%', height:'130px', background:'#050505', marginBottom:'15px', overflow:'hidden', borderRadius:'6px', position:'relative', border: '1px solid #333'}}>
                <img 
                    src={info_panel.image} alt={identity.name}
                    style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85}} 
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop'; }}
                />
            </div>

            <div className="info-table">
                {!isLoggedIn && <div className="info-row link-blue">Sign in to view full specifications</div>}
                {isLoggedIn && <div className="info-row" style={{color:'#10b981', fontWeight:'bold', fontSize:'11px', borderLeft: '3px solid #10b981', paddingLeft: '8px'}}>✓ Authorized Access Granted</div>}
                
                <InfoRow label="Intl' Designator" val={info_panel.intl_designator} />
                <InfoRow label="Orbit Type" val={info_panel.orbit_type} />
                <InfoRow label="Status" val={info_panel.status} />
                <InfoRow label="Satellite Type" val={info_panel.sat_type} />
                <InfoRow label="Country of Origin" val={info_panel.country} />
                <InfoRow label="Owner/Operator" val={info_panel.owner} />
                <InfoRow label="Launch Site" val={info_panel.launch_site} />
                <InfoRow label="Launch Date" val={info_panel.launch_date} />
                
                <InfoRow label="Launch Vehicle" val={isLoggedIn ? info_panel.vehicle : "Sign in to view"} isLocked={!isLoggedIn} />
                <InfoRow label="Mass (kg)" val={isLoggedIn ? info_panel.mass : "Sign in to view"} isLocked={!isLoggedIn} />
            </div>
          </div>
        )}

        {/* --- TAB 2: TLE (RESTORED LIVE DATA) --- */}
        {activeTab === 'TLE' && (
           <div style={{color: '#aaa', fontSize: '12px', padding: '10px'}}>
               <p style={{marginBottom: '10px'}}>Raw TLE data and computed orbital elements.</p>
               <div className="tle-block" style={{
                   marginBottom: '15px', fontFamily: 'monospace', 
                   background: '#111', padding: '10px', borderRadius: '4px', 
                   border: '1px solid #333', color: '#00ffcc', letterSpacing: '1px'
               }}>
                 {tle.line1}<br/>{tle.line2}
               </div>

               <div className="info-table">
                   <InfoRow label="Epoch (UTC)" val={tle_panel.epoch} />
                   <div style={{borderBottom: '1px solid #222', margin:'8px 0'}}></div>
                   
                   {/* THESE ARE NOW PULLING LIVE REACT STATE INSTEAD OF STATIC BACKEND DATA */}
                   <InfoRow label="Speed (Live)" val={liveData ? liveData.speed : "Calculating..."} />
                   <InfoRow label="Height (Live)" val={liveData ? liveData.height : "Calculating..."} />
                   <InfoRow label="Latitude" val={liveData ? liveData.latitude : "Calculating..."} />
                   <InfoRow label="Longitude" val={liveData ? liveData.longitude : "Calculating..."} />
                   
                   <div style={{borderBottom: '1px solid #222', margin:'8px 0'}}></div>
                   
                   <InfoRow label="Inclination" val={tle_panel.inclination} />
                   <InfoRow label="Eccentricity" val={tle_panel.eccentricity} />
                   <InfoRow label="Right Ascension (RAAN)" val={tle_panel.raan} />
                   <InfoRow label="Arg of Perigee" val={tle_panel.arg_perigee} />
                   <InfoRow label="Mean Anomaly" val={tle_panel.mean_anomaly} />
                   <InfoRow label="Mean Motion" val={tle_panel.mean_motion} />
                   <InfoRow label="Orbital Period" val={tle_panel.period} />
                   
                   <div style={{borderBottom: '1px solid #222', margin:'8px 0'}}></div>
                   
                   <InfoRow label="BSTAR Drag Term" val={tle_panel.bstar} />
                   <InfoRow label="1st Derivative" val={tle_panel.first_derivative} />
               </div>
           </div>
        )}

        {/* --- TAB 3: CHARTS --- */}
        {activeTab === 'CHARTS' && charts && (
          <div>
            <ChartBox title="Height (km)" data={createDataset('Height', charts.height, '#3b82f6')} options={chartOptions} />
            <ChartBox title="Latitude" data={createDataset('Lat', charts.lat, '#10b981')} options={chartOptions} />
          </div>
        )}

        {/* --- TAB 4: ML PREDICTIONS --- */}
        {activeTab === 'PREDICT' && isLoggedIn && ml_analytics && (
            <div>
                <div style={{background: '#1a1025', border: '1px solid #7e22ce', padding: '12px', borderRadius: '6px', marginBottom: '15px'}}>
                    <h3 style={{color: '#c084fc', fontSize: '13px', marginTop: 0, marginBottom: '12px', display:'flex', alignItems:'center'}}>
                        🧠 Machine Learning Analytics
                    </h3>
                    
                    <div style={{marginBottom: '12px'}}>
                        <div style={{fontSize:'10px', color:'#a855f7'}}>Estimated Lifespan (Random Forest)</div>
                        <div style={{fontSize:'18px', color:'white', fontWeight:'bold'}}>{ml_analytics.estimated_lifespan}</div>
                    </div>
                    
                    <div style={{marginBottom: '12px'}}>
                        <div style={{fontSize:'10px', color:'#a855f7'}}>Decommission Forecast</div>
                        <div style={{fontSize:'14px', color:'#eee'}}>{ml_analytics.decommission_forecast}</div>
                    </div>

                    <div style={{marginBottom: '12px'}}>
                        <div style={{fontSize:'10px', color:'#a855f7'}}>Orbital Decay Timeline (Gradient Boosting)</div>
                        <div style={{fontSize:'14px', color:'#eee'}}>{ml_analytics.orbital_decay_timeline}</div>
                    </div>

                    <div style={{marginBottom: '10px'}}>
                        <div style={{fontSize:'10px', color:'#a855f7'}}>Utilization Intensity</div>
                        <div style={{width: '100%', background: '#333', height: '6px', borderRadius: '3px', marginTop: '4px'}}>
                            <div style={{width: ml_analytics.utilization_intensity, background: '#a855f7', height: '100%', borderRadius: '3px'}}></div>
                        </div>
                        <div style={{fontSize:'10px', color:'#ccc', marginTop:'4px'}}>{ml_analytics.utilization_intensity} Active</div>
                    </div>
                </div>

                {/* Anomaly Detection Box */}
                <div style={{background: '#111', borderLeft: `4px solid ${ml_analytics.status_color}`, padding: '10px', borderRadius: '4px'}}>
                    <div style={{fontSize:'10px', color:'#888', marginBottom: '4px'}}>Anomaly Detection (Isolation Forest)</div>
                    <div style={{color: ml_analytics.status_color, fontWeight: 'bold', fontSize: '14px'}}>
                        {ml_analytics.anomaly_status}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

// Helper components
const InfoRow = ({ label, val, isLocked }) => (
  <div className="info-row">
    <span className="label" style={{color: '#3b82f6'}}>{label}</span>
    <span className="val" style={{color: isLocked ? '#ef4444' : '#eee', cursor: isLocked ? 'not-allowed' : 'default'}}>
        {val}
    </span>
  </div>
);

const ChartBox = ({ title, data, options }) => (
    <div style={{marginBottom:'20px'}}>
        <div style={{fontSize:'11px', color:'#888', marginBottom:'5px'}}>{title}</div>
        <div style={{height:'80px'}}><Line options={options} data={data} /></div>
    </div>
);

export default DetailedPanel;
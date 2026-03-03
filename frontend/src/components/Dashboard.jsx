import React from 'react';

const Dashboard = ({ data }) => {
  if (!data || !data.identity) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      width: '320px',
      background: 'rgba(5, 5, 5, 0.85)',
      backdropFilter: 'blur(10px)',
      border: '1px solid #333',
      borderLeft: '4px solid #3b82f6', // Blue accent line
      borderRadius: '6px',
      padding: '15px',
      color: 'white',
      fontFamily: 'monospace',
      zIndex: 100,
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      
      {/* Target Lock Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="blinking-dot" style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 8px #ef4444' }}></div>
          <span style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', color: '#ef4444' }}>TARGET LOCKED</span>
        </div>
        <span style={{ fontSize: '10px', color: '#888' }}>SYS_OK</span>
      </div>

      {/* Satellite Identity */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>
          {data.identity.name}
        </div>
        <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '2px' }}>
          NORAD ID: {data.identity.id}
        </div>
      </div>

      {/* Quick Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ background: '#111', padding: '8px', borderRadius: '4px', border: '1px solid #222' }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>ORBIT TYPE</div>
          <div style={{ fontSize: '13px', color: '#10b981' }}>{data.info_panel.orbit_type}</div>
        </div>
        <div style={{ background: '#111', padding: '8px', borderRadius: '4px', border: '1px solid #222' }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>STATUS</div>
          <div style={{ fontSize: '13px', color: data.info_panel.status === 'Operational' ? '#10b981' : '#f59e0b' }}>
            {data.info_panel.status}
          </div>
        </div>
        <div style={{ background: '#111', padding: '8px', borderRadius: '4px', border: '1px solid #222' }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>COUNTRY</div>
          <div style={{ fontSize: '13px', color: '#eee' }}>{data.info_panel.country}</div>
        </div>
        <div style={{ background: '#111', padding: '8px', borderRadius: '4px', border: '1px solid #222' }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>EPOCH YEAR</div>
          <div style={{ fontSize: '13px', color: '#eee' }}>{data.tle_panel.epoch.substring(0, 4)}</div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
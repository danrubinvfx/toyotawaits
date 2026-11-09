import { ImageResponse } from 'next/og';

export const alt = 'ToyotaWaits - Toyota Wait Times & Allocation Tracker';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
          color: '#fafafa',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top Brand Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: '#eb0a1e',
                color: '#ffffff',
                padding: '8px 20px',
                borderRadius: '10px',
                fontSize: '26px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-0.5px',
              }}
            >
              ToyotaWaits
            </div>
            <span
              style={{
                marginLeft: '18px',
                color: '#a1a1aa',
                fontSize: '18px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Wait Times &amp; Allocation Tracker
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '30px',
              padding: '8px 20px',
              fontSize: '16px',
              color: '#e4e4e7',
              fontWeight: 600,
            }}
          >
            🇺🇸 US &bull; 🇨🇦 Canada
          </div>
        </div>

        {/* Center Content */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '20px',
              color: '#eb0a1e',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            Crowdsourced Community Intelligence
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '52px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '20px',
              letterSpacing: '-1px',
            }}
          >
            Real Toyota Wait Times, Timelines &amp; Dealer Markups
          </div>

          {/* Metric Feature Pills */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '14px',
                padding: '16px 24px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                Coverage
              </span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#fafafa', marginTop: '4px' }}>
                RAV4 &bull; Sienna &bull; Grand Highlander
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '14px',
                padding: '16px 24px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                MSRP Transparency
              </span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                Zero Markup Audit
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Footnote */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '15px',
            color: '#71717a',
            borderTop: '1px solid #27272a',
            paddingTop: '20px',
          }}
        >
          <span>Live Community Submissions &bull; Verified Factory Allocations</span>
          <span style={{ color: '#eb0a1e', fontWeight: 700, fontSize: '16px' }}>ToyotaWaits</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

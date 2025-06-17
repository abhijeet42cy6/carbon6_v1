import TiledBackground from './components/TiledBackground';
import backgroundImage from './assets/Group 457.png';

function App() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* This div will now correctly display the imported background image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      />
      
      <TiledBackground>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1>AI Sustainability Analyst</h1>
          <p>for Instantaneous Carbon Audits</p>
        </div>
      </TiledBackground>
    </div>
  );
}

export default App;

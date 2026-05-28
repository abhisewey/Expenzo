import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{
          height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)',
          color: 'var(--text-main)', padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-main)'
        }}>
          <div style={{
            background: 'var(--card-bg)', padding: '3rem', borderRadius: '16px',
            border: '1px solid var(--border-subtle)', boxShadow: 'var(--glass-shadow)',
            maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#f43f5e' }}>
              Oops! Something went wrong.
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
              We've encountered an unexpected error. Please try refreshing the page or clearing your application data if the problem persists.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--hover-bg)',
                  border: '1px solid var(--border-subtle)', color: 'var(--text-main)',
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--hover-bg)'}
              >
                Refresh Page
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                style={{
                  padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'rgba(244,63,94,0.15)',
                  border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e',
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.15)'}
              >
                Clear Data & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

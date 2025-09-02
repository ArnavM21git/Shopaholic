"use client";

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '10px' }}>Something went wrong</h2>
          <p style={{ color: '#7f1d1d', marginBottom: '15px' }}>
            We&apos;re sorry, but something went wrong. Please try refreshing the page.
          </p>
          <p style={{ color: '#b91c1c', fontSize: '0.85rem', wordBreak: 'break-word' }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Technical Details</summary>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '5px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {this.state.error?.toString()}
              {this.state.error?.stack && (
                <>
                  <br /><br />
                  <strong>Stack:</strong><br />
                  {process.env.NODE_ENV === 'development' ? this.state.error.stack : this.state.error.stack?.split('\n').slice(0,5).join('\n')}
                </>
              )}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

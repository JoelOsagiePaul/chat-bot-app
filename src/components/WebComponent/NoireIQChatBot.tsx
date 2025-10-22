import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../../theme';
import { ChatBotFAB } from '../ChatBotFAB/ChatBotFAB';


class NoireIQChatBot extends HTMLElement {
  private root: ReactDOM.Root | null = null;
  private mountPoint: HTMLDivElement | null = null;

  constructor() {
    super();
    // Attach a shadow DOM for style encapsulation
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.mountReactApp();
  }

  disconnectedCallback() {
    this.unmountReactApp();
  }

  static get observedAttributes() {
    return ['title', 'placeholder', 'theme-mode'];
  }

  attributeChangedCallback() {
    if (this.root) {
      this.mountReactApp();
    }
  }

  private mountReactApp() {
    if (!this.shadowRoot) return;

    // Create mount point if it doesn't exist
    if (!this.mountPoint) {
      this.mountPoint = document.createElement('div');
      this.mountPoint.id = 'noireiq-chatbot-root';
      
      // Add styles for the shadow DOM
      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        #noireiq-chatbot-root {
          position: relative;
        }
      `;
      
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(this.mountPoint);
    }

    // Get attributes (for future use with props)
    // const title = this.getAttribute('title') || undefined;
    // const placeholder = this.getAttribute('placeholder') || undefined;

    // Create or update React root
    if (!this.root) {
      this.root = ReactDOM.createRoot(this.mountPoint);
    }

    // Render React app
    this.root.render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ChatBotFAB />
        </ThemeProvider>
      </React.StrictMode>
    );
  }

  private unmountReactApp() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}

export function registerChatBotWebComponent() {
  if (!customElements.get('noireiq-chatbot')) {
    customElements.define('noireiq-chatbot', NoireIQChatBot);
    console.log('✅ NoireIQ ChatBot Web Component registered successfully');
  }
}

export default NoireIQChatBot;

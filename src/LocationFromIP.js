// dependencies / things imported
import { LitElement, html, css } from 'lit';
import { UserIP } from './UserIP.js';
import '@lrnwebcomponents/wikipedia-query';

export class LocationFromIP extends LitElement {
  static get tag() {
    return 'location-from-ip';
  }

  constructor() {
    super();
    this.UserIpInstance = new UserIP();
    this.locationEndpoint = 'http://ip-api.com/json/';
    this.long = null;
    this.lat = null;
  }

  static get properties() {
    return {
      lat: { type: Number, reflect: true },
      long: { type: Number, reflect: true },
      state: { type: String, reflect: true },
      city: { type: String, reflect: true },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getGEOIPData();
  }

  async getGEOIPData() {
    const IPClass = new UserIP();
    const userIPData = await IPClass.updateUserIP();
    return fetch(this.locationEndpoint + userIPData.ip)
      .then(resp => {
        if (resp.ok) {

          return resp.json();
        }
        return false;
      })
      .then(data => {
        this.long = data.lon;
        // test: console.log(data.lon);
        this.lat = data.lat;
        this.state = data.regionName;
        this.city = data.city;
        
        return data;
      });
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iframe {
          height: 500px;
          width: 500px;
        }
      `,
    ];
  }

  render() {
    // this function runs every time a properties() declared variable changes
    // this means you can make new variables and then bind them this way if you like
    const url = `https://maps.google.com/maps?q=${this.lat},${this.long}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    
    return html`
    <iframe title="Where you are" src="${url}"></iframe> <a href="https://www.google.com/maps/@long,lat,14z">Google Maps</a> 
    
    <wikipedia-query search="${this.city}, ${this.state}"></wikipedia-query>
    `;
  }
}

customElements.define(LocationFromIP.tag, LocationFromIP);

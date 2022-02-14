import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/accent-card';

export class NasaImageSearch extends LitElement {
  static get tag() {
    return 'nasa-image-search';
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.returnDataOnly = false;
    this.imageData = []; // Stores image search query data
    this.checked = false;
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      returnDataOnly: { type: Boolean },
      term: { type: String, reflect: true },
      index: { type: Number, reflect: true },
      start_year: { type: String, reflect: true },
      end_year: { type: String, reflect: true },
      imageData: { type: Array },
      checked: { type: Boolean, reflect: true },
    };
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'term' && this[propName]) {
        if (this.term) {
          this.getData();
        }
      }
    });
  }

  getData() {
    // defined
    const file = new URL(
      `https://images-api.nasa.gov/search?q=${this.term}&page=${this.index}&year_start=${this.start_year}&year_end=${this.end_year}&media_type=image`
    );
    // go get our data from Nasa file
    fetch(file)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return false;
      })
      .then(data => {
        // set array to empty
        // each element contains an image object that stores the image link, title, description, and photographer.
        this.imageData = [];
        data.collection.items.forEach(item => {
          let imageObj = {}; // declare object and set to empty
          let href; // grabs link from href before heading into item child

          item.links.forEach(information => {
            href = `${information.href}`;
          });

          item.data.forEach(info => {
            // info = "0" in a Nasa API

            // create an image object
            imageObj = {
              href: `${href}`,
              title: `${info.title}`,
              description: `${info.description}`,
              secondary_creator: `${info.secondary_creator}`,
            };
          });
          this.imageData.push(imageObj); // push objects to array
        });
      });
  }

  // Lit life-cycle; this fires the 1st time the element is rendered on the screen
  // this is a sign it is safe to make calls to this.shadowRoot
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }

  // HTMLElement life-cycle, element has been connected to the page / added or moved
  // this fires EVERY time the element is moved
  connectedCallback() {
    super.connectedCallback();
  }

  // HTMLElement life-cycle, element has been removed from the page OR moved
  // this fires every time the element moves
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  // CSS - specific to Lit
  static get styles() {
    return css`
      :host {
        display: block;
      }
      :host([name='partner']) {
        color: yellow;
        background-color: black;
      }
    `;
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div class="searchReturnArea">
        ${this.checked
          ? html`
              <link rel="stylesheet" type="text/css" href="style.css" />

              <ul>
                ${this.imageData.map(
                  item => html`
                    <div id="list">
                      <li>
                        Link: ${item.href}<br />Title: ${item.title}<br />Description:
                        ${item.description}<br />Secondary Creator:
                        ${item.secondary_creator}
                      </li>
                      <br />
                    </div>
                  `
                )}
              </ul>
            `
          : html`
              ${this.imageData.map(
                item => html`
                  <accent-card
                    image-src="${item.href}"
                    accent-color="blue"
                    dark
                    horizontal
                    style="max-width:1000px; margin-left:auto; margin-right:auto; font-family: 
                  'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: solid white; border-radius:5px"
                  >
                    <div style="max-width:500px;" slot="heading">
                      ${item.title}
                    </div>
                    <div slot="content">
                      ${item.description} - ${item.secondary_creator}
                    </div>
                  </accent-card>
                `
              )}
            `}
      </div>
    `;
  }
}

customElements.define(NasaImageSearch.tag, NasaImageSearch);

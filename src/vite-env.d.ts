/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Formspree form ID for the contact form. This is a PUBLIC endpoint
   * identifier, not a secret — see README "Contact form".
   */
  readonly VITE_FORMSPREE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

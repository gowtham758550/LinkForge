import { bootstrapApplication } from '@angular/platform-browser';
import { config as faConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { appConfig } from './app/app.config';
import { App } from './app/app';

faConfig.autoAddCss = false;

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

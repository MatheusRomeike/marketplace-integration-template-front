import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import moment from 'moment';
moment.locale('pt-br');

bootstrapApplication(App, appConfig);

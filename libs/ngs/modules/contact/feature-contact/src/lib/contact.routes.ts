import { Route } from '@angular/router';
import { ContactTableComponent } from './components/contact/contact-table.component';

export const FEATURE_CONTACT_ROUTES: Route[] = [
  { path: '', component: ContactTableComponent },
];

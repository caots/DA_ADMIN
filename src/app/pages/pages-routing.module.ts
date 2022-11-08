import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployerDetailsComponent } from './manage-employers/employer-details/employer-details.component';
import { ManageEmployersComponent } from './manage-employers/manage-employers.component';
import { JobPostingsDetailsComponent } from './manage-job-postings/job-postings-details/job-postings-details.component';
import { ManageJobPostingsComponent } from './manage-job-postings/manage-job-postings.component';
import { JobseekerDetailsComponent } from './manage-jobseekers/jobseeker-details/jobseeker-details.component';
import { ManageJobseekersComponent } from './manage-jobseekers/manage-jobseekers.component';
import { PagesComponent } from './pages.component';



const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'manage-employer',
      component: ManageEmployersComponent,
    },
    {
      path: 'employer-details',
      component: EmployerDetailsComponent,
    },
    {
      path: 'manage-jobseeker',
      component: ManageJobseekersComponent,
    },
    {
      path: 'jobseeker-details',
      component: JobseekerDetailsComponent,
    },
    {
      path: 'job-postings-details',
      component: JobPostingsDetailsComponent,
    },
    {
      path: 'manage-job-postings',
      component: ManageJobPostingsComponent,
    },
    {
      path: '',
      redirectTo: 'manage-employer',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}

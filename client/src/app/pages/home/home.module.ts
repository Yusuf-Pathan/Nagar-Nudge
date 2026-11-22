import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HeroSectionComponent } from '../../core/components/hero-section/hero-section.component';
import { HowItWorksComponent } from '../../core/components/how-it-works/how-it-works.component';
import { PopularCategoriesComponent } from '../../core/components/popular-categories/popular-categories.component';
import { RecentlyResolvedComponent } from '../../core/components/recently-resolved/recently-resolved.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeroSectionComponent,
    HowItWorksComponent,
    PopularCategoriesComponent,
    RecentlyResolvedComponent
  ],
  imports: [CoreModule, HomeRoutingModule]
})
export class HomeModule {}

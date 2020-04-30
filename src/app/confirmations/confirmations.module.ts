import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmationsPageRoutingModule } from './confirmations-routing.module';
import { SharedModule } from "../shared/shared.module";
import { ConfirmationsPage } from './confirmations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ConfirmationsPageRoutingModule
  ],
  declarations: [ConfirmationsPage]
})
export class ConfirmationsPageModule {}

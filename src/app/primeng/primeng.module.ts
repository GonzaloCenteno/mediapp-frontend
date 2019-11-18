import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    ToolbarModule,
    SplitButtonModule,
    SidebarModule,
    MenuModule,
    FieldsetModule,
    CardModule,
    TableModule,
    DialogModule,
    ToastModule,
    PaginatorModule,
    MessageModule,
    MessagesModule,
    PanelModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    DropdownModule,
    CalendarModule,
    AccordionModule
  ], exports:[
    ButtonModule,
    ToolbarModule,
    SplitButtonModule,
    SidebarModule,
    MenuModule,
    FieldsetModule,
    CardModule,
    TableModule,
    DialogModule,
    ToastModule,
    PaginatorModule,
    MessageModule,
    MessagesModule,
    PanelModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    DropdownModule,
    CalendarModule,
    AccordionModule
  ]
})
export class PrimengModule { }
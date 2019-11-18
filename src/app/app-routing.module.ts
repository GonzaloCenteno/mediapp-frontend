import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonaComponent } from './pages/persona/persona.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { VentaComponent } from './pages/venta/venta.component';


const routes: Routes = [
  { path: 'persona', component: PersonaComponent },
  { path: 'producto', component: ProductoComponent },
  { path: 'venta', component: VentaComponent },
  { path: '', redirectTo: 'persona', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

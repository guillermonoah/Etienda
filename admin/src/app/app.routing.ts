import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { LoginComponent } from "./components/login/login.component";

import { adminGuard  } from "./guards/admin.guard";
import { AdminService } from "./services/admin.service";
import { IndexClienteComponent } from "./components/clientes/index-cliente/index-cliente.component";
import { CreateClienteComponent } from "./components/clientes/create-cliente/create-cliente.component";
import { EditClienteComponent } from "./components/clientes/edit-cliente/edit-cliente.component";
import { CreateProductoComponent } from "./components/productos/create-producto/create-producto.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { UpdateProductoComponent } from "./components/productos/update-producto/update-producto.component";
import { InventarioProductoComponent } from "./components/productos/inventario-producto/inventario-producto.component";
import { CreateCuponComponent } from "./components/cupones/create-cupon/create-cupon.component";
import { IndexCuponComponent } from "./components/cupones/index-cupon/index-cupon.component";
import { UpdateCuponComponent } from "./components/cupones/update-cupon/update-cupon.component";
import { ConfigComponent } from "./components/config/config.component";
import { VariedadProductoComponent } from "./components/productos/variedad-producto/variedad-producto.component";
import { GaleriaProductoComponent } from "./components/productos/galeria-producto/galeria-producto.component";
import { IndexDescuentoComponent } from "./components/descuentos/index-descuento/index-descuento.component";
import { CreateDescuentoComponent } from "./components/descuentos/create-descuento/create-descuento.component";
import { EditDescuentoComponent } from "./components/descuentos/edit-descuento/edit-descuento.component";
import { IndexContactoComponent } from "./components/contacto/index-contacto/index-contacto.component";
import { ReviewsProductoComponent } from "./components/productos/reviews-producto/reviews-producto.component";
import { IndexVentasComponent } from "./components/ventas/index-ventas/index-ventas.component";
import { DetallesVentasComponent } from "./components/ventas/detalles-ventas/detalles-ventas.component";

const appRoute: Routes = [
    {path: '', redirectTo: 'inicio', pathMatch:'full'},
    {path: 'inicio', component: InicioComponent, canActivate:[adminGuard]},
    {path: 'panel',children:[
       {path:'clientes', component: IndexClienteComponent, canActivate:[adminGuard]},
       {path:'clientes/registro', component: CreateClienteComponent, canActivate:[adminGuard]},
       {path:'clientes/:id', component: EditClienteComponent, canActivate:[adminGuard]},

       {path:'productos/registro', component: CreateProductoComponent, canActivate:[adminGuard]},
       {path:'productos', component: IndexProductoComponent, canActivate:[adminGuard]},
       {path:'productos/:id', component: UpdateProductoComponent, canActivate:[adminGuard]},
       {path:'productos/inventario/:id', component: InventarioProductoComponent, canActivate:[adminGuard]},
       {path:'productos/variedades/:id', component: VariedadProductoComponent, canActivate:[adminGuard]},
       {path:'productos/galeria/:id', component: GaleriaProductoComponent, canActivate:[adminGuard]},
       {path:'productos/reviews/:id', component: ReviewsProductoComponent, canActivate:[adminGuard]},

       {path:'cupones/registro', component: CreateCuponComponent, canActivate:[adminGuard]},
       {path:'cupones', component: IndexCuponComponent, canActivate:[adminGuard]},
       {path:'cupones/:id', component: UpdateCuponComponent, canActivate:[adminGuard]},

       {path:'descuentos', component: IndexDescuentoComponent, canActivate:[adminGuard]},
       {path:'descuentos/registro', component: CreateDescuentoComponent, canActivate:[adminGuard]},
       {path:'descuentos/:id', component: EditDescuentoComponent, canActivate:[adminGuard]},

       {path:'config', component: ConfigComponent, canActivate:[adminGuard]},

       {path:'ventas', component: IndexVentasComponent, canActivate:[adminGuard]},
       {path:'ventas/:id', component: DetallesVentasComponent, canActivate:[adminGuard]},

       {path:'contactos', component: IndexContactoComponent, canActivate:[adminGuard]},
    ]},
    {path: 'login', component: LoginComponent },
]

export const appRoutingProviders: any[]=[];
export const routing:ModuleWithProviders<any> = RouterModule.forRoot(appRoute);
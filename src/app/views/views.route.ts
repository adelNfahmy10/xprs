import type { Route } from '@angular/router'
import { InboxComponent } from './apps/inbox/inbox.component'
import { MessagesComponent } from './apps/messages/messages.component'
import { OrderComponent } from './order/order.component';
import { ReviewsComponent } from './apps/reviews/reviews.component'
import { TransactionsComponent } from './apps/transactions/transactions.component'
import { WidgetsComponent } from './apps/widgets/widgets.component'
import { HomeComponent } from './home/home.component'
import { CategoriesComponent } from './categories/categories.component'
import { ProductsComponent } from './products/products.component'
import { ShopComponent } from './shop/shop.component'
import { BrandComponent } from './brand/brand.component'
import { StoreComponent } from './store/store.component'
import { FavoriteComponent } from './favorite/favorite.component'
import { GameComponent } from './game/game.component'
import { CartComponent } from './cart/cart.component'
import { CheckoutComponent } from './checkout/checkout.component'
import { OrdersComponent } from './apps/orders/orders.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { ShippingInstructionsComponent } from './shipping-instructions/shipping-instructions.component';

export const VIEWS_ROUTES: Route[] = [
  {
    path:'', redirectTo:'home', pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' },
  },
  {
    path: 'shop',
    component: ShopComponent,
    data: { title: 'Shop' },
  },
  {
    path: 'brand',
    component: BrandComponent,
    data: { title: 'Brands' },
  },
  {
    path: 'brand/:brandId',
    component: CategoriesComponent,
    data: { title: 'Brand' },
  },
  {
    path: 'store',
    component: StoreComponent,
    data: { title: 'Store' },
  },
  {
    path: 'favorite',
    component: FavoriteComponent,
    data: { title: 'Favorites' },
  },
  {
    path: 'myorder',
    component: OrderComponent,
    data: { title: 'Order' },
  },
  {
    path: 'game',
    component: GameComponent,
    data: { title: 'Game' },
  },
  {
    path: 'category',
    component: CategoriesComponent,
    data: { title: 'Categoreis' },
  },
  {
    path: 'category/:id',
    component: CategoriesComponent,
    data: { title: 'Category' },
  },
  {
    path: 'category/:id/:subId',
    component: CategoriesComponent,
    data: { title: 'Category' },
  },
  {
    path: 'product',
    component: ProductsComponent,
    data: { title: 'Products' },
  },
  {
    path: 'product/:slug',
    component: ProductsComponent,
    data: { title: 'Product' },
  },
  {
    path: 'cart',
    component: CartComponent,
    data: { title: 'Cart' },
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    data: { title: 'Checkout' },
  },
  {
    path: 'login',
    component: SigninComponent,
    data: { title: 'Login' },
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'SignUp' },
  },
  {
    path: 'account-info',
    component: AccountInfoComponent,
    data: { title: 'Account Info' },
  },
  {
    path: 'shipping-instructions',
    component: ShippingInstructionsComponent,
    data: { title: 'Shipping & Delivery instructions' },
  },




  {
    path: 'dashboards',
    loadChildren: () =>
      import('./dashboards/dashboard.route').then(
        (mod) => mod.DASHBOARD_ROUTES
      ),
  },
  {
    path: 'property',
    loadChildren: () =>
      import('./property/property.route').then((mod) => mod.PROPERTY_ROUTES),
  },
  {
    path: 'agents',
    loadChildren: () =>
      import('./agents/agents.route').then((mod) => mod.AGENT_ROUTES),
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./customers/customers.route').then((mod) => mod.CUSTOMER_ROUTES),
  },
  {
    path: 'orders',
    component: OrdersComponent,
    data: { title: 'Orders' },
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    data: { title: 'Transactions' },
  },
  {
    path: 'reviews',
    component: ReviewsComponent,
    data: { title: 'Reviews' },
  },
  {
    path: 'messages',
    component: MessagesComponent,
    data: { title: 'Messages' },
  },
  {
    path: 'inbox',
    component: InboxComponent,
    data: { title: 'Inbox' },
  },
  {
    path: 'post',
    loadChildren: () =>
      import('./post/post.route').then((mod) => mod.POST_ROUTES),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.route').then((mod) => mod.PAGES_ROUTES),
  },
  {
    path: 'widgets',
    component: WidgetsComponent,
    data: { title: 'Widgets' },
  },
  {
    path: 'ui',
    loadChildren: () => import('./ui/ui.route').then((mod) => mod.UI_ROUTES),
  },
  {
    path: 'extended',
    loadChildren: () =>
      import('./extended/extended.route').then((mod) => mod.EXTENDED_ROUTES),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('./charts/charts.route').then((mod) => mod.CHART_ROUTES),
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('./forms/forms.route').then((mod) => mod.FORMS_ROUTES),
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('./tables/table.route').then((mod) => mod.TABLE_ROUTES),
  },
  {
    path: 'icons',
    loadChildren: () =>
      import('./icons/icons.route').then((mod) => mod.ICONS_ROUTES),
  },
  {
    path: 'maps',
    loadChildren: () =>
      import('./maps/maps.route').then((mod) => mod.MAPS_ROUTES),
  },
]

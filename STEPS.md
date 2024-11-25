Overview
========

The file replicates information from the `Spring Boot Microservices Tutorial - Part 7 <https://programmingtechie.com/articles/spring-boot-microservices-tutorial-part-7>`
June 9, 2024 © 2024 Sai Upadhyayula

# Create Angular Scaffolding Project
To get started, let's create a new angular project with the below command:

``ng new microservices-shop-frontend``

Angular CLI will ask you a set of questions, I will provide the answers to the relevant settings for the project, for the rest of the settings, feel free to pick as per your preferences.

``Which stylesheet format would you like to use? - CSS
Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? N``

After answering the above questions, press Enter, and the project should now be created successfully.

Once the project is created, you can start the scaffolding application by typing the below command:

``ng serve`` 
Or
``npm start``

Angular CLI will now compile the project and start a webserver to serve the application and it will also watch for the changes in the project files so that whenever a change occurs in the code, the webserver will automatically reload and apply the new changes.

After the application is started successfully open the URL - `http://localhost:4200 <http://localhost:4200>

Now you have created the Angular app, now it's time to configure Tailwind CSS as our CSS framework.

# Install Tailwind CSS
We will be using TailwindCSS as our CSS framework, to install it in our angular project, type the below commands:

``npm install -D tailwindcss postcss autoprefixer``

``npx tailwindcss init``

After executing both commands there will be a ``tailwind.config.js`` file, update its content below:

``
    /** @type {import('tailwindcss').Config} */
    module.exports = {
        content: [
          "./src/**/*.{html,ts}",
        ],
        theme: {
          extend: {},
        },
        plugins: [],
  }
``

The above configuration will apply tailwind CSS to all the HTML templates in our project.

To enable CSS, we also have to update the src/styles.css file with the following code:

@tailwind base;
@tailwind components;
@tailwind utilities;
Once this is done, restart the application by running the ng serve command again.

Add Angular Auth OIDC Client dependency
The next thing we are going to do is to enable OAuth2 capabilities in our project, by adding the angular-auth-oidc-client dependency, by executing the below command:

 npm install angular-auth-oidc-client
After installing the library, we need to configure it by creating a file called src/app/config/auth-config.ts

import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'http://localhost:8181/realms/spring-microservices-security-realm',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: 'angular-client',
    scope: 'openid profile offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
  }
}

The above configuration will set up our angular application to talk with the Keycloak server, if you want to revise how to set up the Keycloak server, refer to my previous post here - https://programmingtechie.com/2024/04/18/spring-boot-microservices-tutorial-part-4/

The authority field is pointing to the URL of the Realm we created in the previous parts, and then the client ID is going to be angular-client, which is the name of the client ID we will create soon in Keycloak.

We are going to use the Refresh Token mechanism to get a new token whenever our existing token is expired.

Create Header Component
So in the next step, we are going to add the header component, to generate a new component, type the following command:

ng g c shared/header
The above command generates a component at the location src/app/shared/header, if you just provide header instead of shared/header, then the component will be created at location - src/app/header

header.component.html

<nav class="bg-white border border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800 shadow">
    <div class="container flex flex-wrap justify-between items-center mx-auto">
        <a href="/" class="flex items-center">
      <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
        Spring Boot Microservices Shop
      </span>
        </a>

        <div class="flex items-center">
            <button
                    id="menu-toggle"
                    type="button"
                    class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            >
                <span class="sr-only">Open main menu</span>
                <!-- Hamburger icon -->
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                    />
                </svg>
            </button>
        </div>

        <div
                class="w-full md:block md:w-auto hidden"
                id="mobile-menu"
        >
            <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                <li>
                    @if (isAuthenticated) {
                      <p class="text-white">Hi {{ username }}</p>
                      <a
                        (click)="logout()"
                        class="block py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                        Logout
                      </a>
                    } @else {
                      <a
                        (click)="login()"
                        class="block py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                        Login
                      </a>
                    }
                </li>
            </ul>
        </div>

    </div>
</nav>

header.component.ts

import {Component, inject, OnInit} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  private readonly oidcSecurityService = inject(OidcSecurityService);
  isAuthenticated = false;
  username = "";

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
      }
    )
    this.oidcSecurityService.userData$.subscribe(
      ({userData}) => {
        this.username = userData.preferred_username
      }
    )
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }
}

The header component is mainly responsible for displaying the information about the currently logged-in user (like the username) and then providing the links to Login/Logout of the application. Here we are using the OidcSecurityService from the angular-auth-oidc-client dependency to implement login and logout functionalities.

Create Home Page Component
The next step is going to be to create the Home Page component

home-page.component.html
``
<main>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold mb-4">Products ({{ products.length }})</h1>
      @if (isAuthenticated) {
        <button class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 ml-4"
                (click)="goToCreateProductPage()">
          Create Product
        </button>
      }
    </div>
    @if (products.length > 0) {
      @if (orderSuccess) {
        <h4 class="text-green-500 font-bold">Order Placed Successfully</h4>
      } @else if (orderFailed) {
        <h4 class="text-red-500 font-bold">Order Failed, please try again later</h4>
        @if(quantityIsNull) {
          <h4 class="text-red-500 font-bold">Quantity cannot be null</h4>
        }
      }
      <ul class="list-disc list-inside">
        @for (product of products; track product.id) {
          <li class="mb-2 p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <span class="font-semibold">{{ product.name }}</span> -
              <span class="text-gray-600">
                Price: {{ product.price }}
              </span>
              <br/>
              <span >
                Quantity: <input type="number" #quantityInput/>
              </span>Order Placed SuccessfullyOrder Placed Successfully
              <br/>
            </div>
            <button class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 ml-4"
                    (click)="orderProduct(product, quantityInput.value)">
              Order Now
            </button>
          </li>
        }
      </ul>
    } @else if (products.length === 100) {
      <span class="text-sm text-gray-700">
      Click <a class="text-blue-500 hover:underline cursor-pointer">Load More</a> to see more products
    </span>
    } @else {
      <p class="text-red-500 font-semibold">No products found!</p>
    }
  </div>
</main>
``

home-page.component.ts

``
import {Component, inject, OnInit} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Product} from "../../model/product";
import {ProductService} from "../../services/product/product.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {Router} from "@angular/router";
import {Order} from "../../model/order";
import {FormsModule} from "@angular/forms";
import {OrderService} from "../../services/order/order.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    FormsModule
  ],
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  isAuthenticated = false;
  products: Array<Product> = [];
  quantityIsNull = false;
  orderSuccess = false;
  orderFailed = false;

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
        this.productService.getProducts()
          .pipe()
          .subscribe(product => {
            this.products = product;
          })
      }
    )
  }

  goToCreateProductPage() {
    this.router.navigateByUrl('/add-product');
  }

  orderProduct(product: Product, quantity: string) {

    this.oidcSecurityService.userData$.subscribe(result => {
      const userDetails = {
        email: result.userData.email,
        firstName: result.userData.firstName,
        lastName: result.userData.lastName
      };

      if(!quantity) {
        this.orderFailed = true;
        this.orderSuccess = false;
        this.quantityIsNull = true;
      } else {
        const order: Order = {
          skuCode: product.skuCode,
          price: product.price,
          quantity: Number(quantity),
          userDetails: userDetails
        }

        this.orderService.orderProduct(order).subscribe(() => {
          this.orderSuccess = true;
        }, error => {
          this.orderFailed = true;
        })
      }
    })
  }
}
``

The home page will interact with the Order Service, that is responsible to make HTTP calls to our microservice backend, to create the order service, type the below command:

ng g s services/order
And then add the below code:

order.service.ts

import {Component, inject, OnInit} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Product} from "../../model/product";
import {ProductService} from "../../services/product/product.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {Router} from "@angular/router";
import {Order} from "../../model/order";
import {FormsModule} from "@angular/forms";
import {OrderService} from "../../services/order/order.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    FormsModule
  ],
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  isAuthenticated = false;
  products: Array<Product> = [];
  quantity = 1;
  orderSuccess = false;
  orderFailed = false;

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
        this.productService.getProducts()
          .pipe()
          .subscribe(product => {
            this.products = product;
          })
      }
    )
  }

  goToCreateProductPage() {
    this.router.navigateByUrl('/add-product');
  }

  orderProduct(product: Product, quantity: string) {

    this.oidcSecurityService.userData$.subscribe(result => {
      const userDetails = {
        email: result.userData.email,
        firstName: result.userData.firstName,
        lastName: result.userData.lastName
      };

      const order: Order = {
        skuCode: product.skuCode,
        price: product.price,
        quantity: Number(quantity),
        userDetails: userDetails
      }

      this.orderService.orderProduct(order).subscribe(() => {
        this.orderSuccess = true;
      }, error => {
        this.orderFailed = false;
      })
    })
  }
}

We also need to create the model classes to transfer the payload, for that create a package called model and a file inside called order.ts

export interface Order {
  id?: number;
  orderNumber?: string;
  skuCode: string;
  price: number;
  quantity: number;
  userDetails: UserDetails
}

export interface UserDetails {
  email: string;
  firstName: string;
  lastName: string;
}

When we are making calls from the frontend to the backend we have to make sure that our frontend is sending the access token for each HTTP request to the backend, for that we need to create an interceptor to intercept all outgoing requests and add the token.

interceptor/auth.interceptor.ts

import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {OidcSecurityService} from "angular-auth-oidc-client";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(OidcSecurityService);

  authService.getAccessToken().subscribe(token => {
    if (token) {
      let header = 'Bearer ' + token;

      let headers = req.headers
        .set('Authorization', header);

      req = req.clone({headers});

      return next(req);
    }

    return next(req);
  })

  return next(req);

}

We are also reading the products from the backend and displaying them in the frontend, for that we also have to create a product service similar to the order service by executing the below command:

ng g s services/product
product.service.ts

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../../model/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) {
  }

  getProducts(): Observable<Array<Product>> {
    return this.httpClient.get<Array<Product>>('http://localhost:9000/api/product');
  }

  createProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>('http://localhost:9000/api/product', product);
  }
}

model/product.ts

export interface Product {
  id?: string;
  skuCode: string;
  name: string;
  description: string;
  price: number;
}

Create Add Product Component
We also need to create a component to Add Products, for that execute the below command:

ng g c pages/add-product
add-product.component.html

<div class="container mx-auto p-4">
  <h2 class="text-2xl font-bold mb-4">Add Product</h2>
  @if (productCreated) {
    <h4 class="text-green-500">Product Created Successfully</h4>
  }
  <form [formGroup]="addProductForm" (ngSubmit)="onSubmit()">
    <div class="mb-4">
      <label class="block text-gray-700" for="skuCode">SKU Code</label>
      <input
        type="text"
        id="skuCode"
        formControlName="skuCode"
        class="border rounded w-full py-2 px-3 text-gray-700"
      />
      <div *ngIf="skuCode?.invalid && (skuCode?.dirty || skuCode?.touched)" class="text-red-500">
        <div *ngIf="skuCode?.errors?.['required']">SKU Code is required.</div>
        <div *ngIf="skuCode?.errors?.['minlength']">SKU Code must be at least 3 characters long.</div>
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700" for="name">Name</label>
      <input
        type="text"
        id="name"
        formControlName="name"
        class="border rounded w-full py-2 px-3 text-gray-700"
      />
      <div *ngIf="name?.invalid && (name?.dirty || name?.touched)" class="text-red-500">
        <div *ngIf="name?.errors?.['required']">Name is required.</div>
        <div *ngIf="name?.errors?.['minlength']">Name must be at least 3 characters long.</div>
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700" for="description">Description</label>
      <textarea
        id="description"
        formControlName="description"
        class="border rounded w-full py-2 px-3 text-gray-700"
      ></textarea>
      <div *ngIf="description?.invalid && (description?.dirty || description?.touched)" class="text-red-500">
        <div *ngIf="description?.errors?.['required']">Description is required.</div>
        <div *ngIf="description?.errors?.['minlength']">Description must be at least 10 characters long.</div>
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700" for="price">Price</label>
      <input
        type="number"
        id="price"
        formControlName="price"
        class="border rounded w-full py-2 px-3 text-gray-700"
      />
      <div *ngIf="price?.invalid && (price?.dirty || price?.touched)" class="text-red-500">
        <div *ngIf="price?.errors?.['required']">Price is required.</div>
        <div *ngIf="price?.errors?.['min']">Price must be greater than 0.</div>
      </div>
    </div>

    <button
      type="submit"
      class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      [disabled]="addProductForm.invalid"
    >
      Add Product
    </button>
  </form>
</div>

add-product.component.ts

import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Product} from "../../model/product";
import {ProductService} from "../../services/product/product.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  addProductForm: FormGroup;
  private readonly productService = inject(ProductService);
  productCreated = false;

  constructor(private fb: FormBuilder) {
    this.addProductForm = this.fb.group({
      skuCode: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required]]
    })
  }

  onSubmit(): void {
    if (this.addProductForm.valid) {
      const product: Product = {
        skuCode: this.addProductForm.get('skuCode')?.value,
        name: this.addProductForm.get('name')?.value,
        description: this.addProductForm.get('description')?.value,
        price: this.addProductForm.get('price')?.value
      }
      this.productService.createProduct(product).subscribe(product => {
        this.productCreated = true;
        this.addProductForm.reset();
      })
    } else {
      console.log('Form is not valid');
    }
  }

  get skuCode() {
    return this.addProductForm.get('skuCode');
  }

  get name() {
    return this.addProductForm.get('name');
  }

  get description() {
    return this.addProductForm.get('description');
  }

  get price() {
    return this.addProductForm.get('price');
  }
}

Configure Routes
Now we have a couple of components, we have to configure routing between these components, for open the app.routes.ts file and add the below content:

import {Routes} from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {AddProductComponent} from "./pages/add-product/add-product.component";

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'add-product', component: AddProductComponent}
];

Now let's add some final configuration changes to enable the functionalities like HTTP Client, OAuth2, and interceptor in our angular application, by updating the app.config.ts file:

import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authConfig} from "./config/auth.config";
import {provideAuth} from "angular-auth-oidc-client";
import {authInterceptor} from "./interceptor/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAuth(authConfig),
  ]
};

And finally, this is how the app.component.html file looks like:

<app-header></app-header>
<router-outlet />
Setting up Angular Client in Keycloak
Before we go ahead and test our application, we have to create the Angular Client in the Keycloak server. For that open localhost:8181 and login to Keycloak with your admin credentials.

Select the realm - spring-microservices-security-realm

Click on Clients on the left side menu bar

Click on the Create client button

Enter Client ID as angular-client

Click Next

Only Select the option - Standard Flow and nothing else, de-select the option Direct access grants that is enabled by default, we don't need it for our use case

Click Next

Under the input Valid redirect URIs - provide the value - http://localhost:4200

Under the input Web origins - provide the value - * to allow requests from all origins.

Click on Save

That's all you need to configure the Angular client in Keycloak, we already configured our Angular app to use the client we just created.

Enable User Registration for Keycloak
The next thing we want to do is to enable the users to self-register on Keycloak, for that open the Realm Settings, click on Login, and select the User Registration option to enable it.

Enable CORS on API Gateway
Before we go ahead and test our implementation, we have to enable CORS on the API Gateway because our Frontend application is running at http://localhost:4200, whereas our API Gateway is running at http://localhost:9000, as they are two different origins, the browser will not allow the requests to the API Gateway, it will only allow if we explicitly allow the origin in our API Gateway.

To add this configuration, use the following configuration in the SecurityConfig.java class of the API Gateway project.

package com.programming.techie.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final String[] freeResourceUrls = {"/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**",
            "/swagger-resources/**", "/api-docs/**", "/aggregate/**"};

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity.authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(freeResourceUrls)
                        .permitAll()
                        .anyRequest().authenticated())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.applyPermitDefaultValues();
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

We created a bean called corsConfigurationSource and inside the bean, we are allowing any HTTP method, in a production-grade application you should not do this, but instead should check which HTTP method is allowed, as well as which URL is allowed to access your service.

Testing the application
To test the application, open the URL: http://localhost:4200 you will be greeted with the page that looks like below:

Home Page

Click on Login and you will be redirected to the Keycloak login page.

On the login page, click on Register provide the necessary details, and submit it.

You will be automatically logged in to the application.

If you don't have any products in the product service, you can create one by clicking on the Add Products Page providing the necessary information, and submit it.

Add Products

After adding the product, you can view it on the home page like below:

Home Page with products

You can order the products by clicking on the Order Now button, make sure to add the quantity before you click on the Order Now button.

Conclusion
I hope you learned something from this tutorial, in the next tutorial we will continue with our microservices series and we will see how to implement event driven architecture using Kafka in our microservices project.


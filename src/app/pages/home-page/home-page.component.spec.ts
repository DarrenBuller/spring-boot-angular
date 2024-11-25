import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { OidcSecurityServiceStub } from '../../stub/OidcSecurityServiceStub';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from '../../services/product/product.service';
import { OrderService } from '../../services/order/order.service';

// describe('HomePageComponent', () => {
//   let component: HomePageComponent;
//   let fixture: ComponentFixture<HomePageComponent>;
//   const mockProductService = jasmine.createSpyObj("ProductService", ["getProducts", "createProduct"]);
//   const mockOrderService = jasmine.createSpyObj("OrderService", ["orderProduct"]);


//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [HomePageComponent],
//       providers: [
//         {provide: OidcSecurityService, useClass: OidcSecurityServiceStub},
//         {provide: ProductService, useValue: mockProductService},
//         {provide: OrderService, useValue: mockOrderService},
//         provideHttpClient(),
//         provideHttpClientTesting()
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(HomePageComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

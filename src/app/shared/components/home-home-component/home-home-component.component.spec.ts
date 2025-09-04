import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHomeComponentComponent } from './home-home-component.component';

describe('HomeHomeComponentComponent', () => {
  let component: HomeHomeComponentComponent;
  let fixture: ComponentFixture<HomeHomeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHomeComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHomeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

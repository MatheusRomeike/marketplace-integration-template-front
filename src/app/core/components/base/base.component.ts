import { Component, inject } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, Subscription } from 'rxjs';
import { StateService } from '../../../shared/services/state.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  template: '',

  imports: [],
})
export class BaseComponent {
  protected stateService = inject(StateService);
  public subscriptions = new Subscription();

  public isLoading: boolean = false;
  public empresaId: number;

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public observableContext(): Observable<number | undefined> {
    return this.stateService.tenant$.pipe(
      map(p => {
        this.empresaId = p?.id;
        return p?.id;
      })
    );
  }
}

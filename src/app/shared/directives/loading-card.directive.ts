import {
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { LoadingCardComponent } from '../components/loading-card/loading-card.component';

@Directive({
  selector: '[appLoadingCard]',
  standalone: true
})
export class LoadingCardDirective implements OnChanges {
  @Input() appLoadingCard = false;
  @Input() appLoadingCardMessage = 'Carregando...';

  private loadingRef?: ComponentRef<LoadingCardComponent>;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appLoadingCardMessage'] && this.loadingRef) {
      this.loadingRef.instance.message = this.appLoadingCardMessage;
    }

    this.render();
  }

  private render(): void {
    this.viewContainerRef.clear();
    this.loadingRef = undefined;

    if (this.appLoadingCard) {
      this.loadingRef = this.viewContainerRef.createComponent(LoadingCardComponent);
      this.loadingRef.instance.message = this.appLoadingCardMessage;
      return;
    }

    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }
}

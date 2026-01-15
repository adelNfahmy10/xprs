import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import Choices, { Options as ChoiceOption } from 'choices.js';

export type SelectOptions = Partial<ChoiceOption>;

@Directive({
  selector: '[selectFormInput]',
  standalone: true,
})
export class SelectFormInputDirective implements AfterViewInit, OnDestroy {

  @Input() className?: string;
  @Input() onChange?: (text: string) => void;
  @Input() options?: SelectOptions;

  private choices!: Choices;

  constructor(private eleRef: ElementRef<HTMLSelectElement>) {}

  ngAfterViewInit(): void {
    this.initChoices();
  }

  private initChoices(): void {
    this.choices = new Choices(this.eleRef.nativeElement, {
      placeholder: true,
      allowHTML: true,
      shouldSort: false,
      ...this.options,
    });

    this.eleRef.nativeElement.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLSelectElement;
      this.onChange?.(target.value);
    });
  }

  ngOnDestroy(): void {
    this.choices?.destroy();
  }
}

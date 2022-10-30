import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appBrokenImg]'
})
export class BrokenImgDirective {
  @Input() defaultImage: string;
  constructor(private elementRef: ElementRef) { 
    this.defaultImage = "";
  }
  
  @HostListener('error')
  loadDefaultImage() {
    this.elementRef.nativeElement.src = this.defaultImage || '../../assets/images/undraw_page_404_re_e9o6.svg';
  }
}

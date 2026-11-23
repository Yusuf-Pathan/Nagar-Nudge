import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]'
})
export class ImageFallbackDirective {
  @Input() appImageFallback = 'assets/images/placeholder.svg';

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    const img = this.el.nativeElement;
    if (!img.src.includes(this.appImageFallback)) {
      img.src = this.appImageFallback;
    }
  }
}

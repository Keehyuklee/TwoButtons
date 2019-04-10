import {
  Directive,
  Input,
  HostListener,
  Renderer2,
  ElementRef
} from "@angular/core";

import { TooltipService } from "./tooltip.service";

@Directive({
  selector: "[tooltip]"
})
export class TooltipDirective {
  @Input("tooltip") tooltipText: string;

  constructor(
    private tooltipService: TooltipService,
    private renderer: Renderer2,
    private element: ElementRef
  ) {}

  @HostListener("click") onMouseClick() {
    if (!this.tooltipService.tooltip) {
      this.createTooltip();
      this.showTooltip();
    } else {
      this.hideTooltip();
      this.createTooltip();
      this.showTooltip();
    }
  }

  @HostListener("window:click", ["$event"])
  onMouseClickInWindow(event) {
    if(event.target.localName !== "span" && event.target.localName !== "button") {
      this.hideTooltip();
    }
  }

  @HostListener("window:keyup", ["$event"])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.hideTooltip();
    }
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if(this.tooltipService.tooltip){
      const hostPosition = this.element.nativeElement.getBoundingClientRect();
      const tooltipPosition = this.tooltipService.tooltip.getBoundingClientRect();
      let top = hostPosition.top - tooltipPosition.height;

      if(top < 20){
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.renderer.setStyle(
          this.tooltipService.tooltip,
          "top",
          `${hostPosition.bottom + scrollPosition + 10}px`
        );
      }
      else {
        this.renderer.setStyle(
          this.tooltipService.tooltip,
          "top",
          `${top - 10}px`
        );
      }
    }
  }

  createTooltip() {
    this.tooltipService.tooltip = this.renderer.createElement("span");
    this.renderer.appendChild(
      this.tooltipService.tooltip,
      this.renderer.createText(this.tooltipText)
    );
    this.renderer.appendChild(document.body, this.tooltipService.tooltip);
    this.renderer.addClass(this.tooltipService.tooltip, "tooltip");
  }

  showTooltip() {
    this.placeTooltip();
    this.renderer.addClass(this.tooltipService.tooltip, "tooltip-show");
  }

  hideTooltip() {
    if (this.tooltipService.tooltip) {
      this.renderer.removeClass(this.tooltipService.tooltip, "tooltip-show");
      this.renderer.removeChild(document.body, this.tooltipService.tooltip);
      this.tooltipService.tooltip = null;
    }
  }

  placeTooltip() {
    const hostPosition = this.element.nativeElement.getBoundingClientRect();
    const tooltipPosition = this.tooltipService.tooltip.getBoundingClientRect();

    let top = hostPosition.top - tooltipPosition.height;
    let left = hostPosition.left + (hostPosition.width - tooltipPosition.width) / 2;

    this.renderer.setStyle(
      this.tooltipService.tooltip,
      "top",
      `${top - 10}px`
    );
    this.renderer.setStyle(this.tooltipService.tooltip, "left", `${left}px`);
  }
}

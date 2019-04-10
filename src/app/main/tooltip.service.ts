import { Injectable, HostListener } from "@angular/core";

@Injectable({ providedIn: "root" })
export class TooltipService {
  tooltip: HTMLElement;
}

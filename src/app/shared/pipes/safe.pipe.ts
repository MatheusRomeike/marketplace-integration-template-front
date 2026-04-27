import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({ name: "safe" })
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    transform(url: any, type: any) {
        if (type === "html" && url) return this.sanitizer.bypassSecurityTrustHtml(url);
        if (type === "url" && url) return this.sanitizer.bypassSecurityTrustUrl(url);
        if (type === "urlResource" && url) return this.sanitizer.bypassSecurityTrustResourceUrl(url);

        return null;
    }
}

import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(@Inject(Injector) private readonly injector: Injector) {}

  handleError(error: any) {
    console.error(error);
    this.toastrService.error(error);
  }

  /**
   * Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
   * @returns {}
   */
  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }
}

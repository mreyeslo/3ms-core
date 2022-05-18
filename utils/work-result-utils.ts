import { WorkResult } from '../model';
import { MessageService } from 'primeng/api';
import { SaveObject } from '../model/save-object';

export class WorkResultUtils {
  static handleWorkResult<T>(workResult: WorkResult<T>, messageService: MessageService): boolean {
    WorkResultUtils.handleErrors(workResult, messageService);
    if (workResult.isAccessDenied) {
      messageService.add({ key: 'tc', life: 5000, severity: 'error', summary: `Access Denied for Operation`, detail: `<div>Please Contact Administrator</div>` });
      return false;
    }
    return true;
  }

  static handleSaveResult(workResult: WorkResult<SaveObject>, messageService: MessageService): boolean {
    WorkResultUtils.handleErrors(workResult, messageService);
    if (workResult.returnObject.ReturnCode === 0) {
      messageService.add({ key: 'tc', life: 1000, severity: 'error', summary: `Operation Failed`, detail: `<div>Please Review Submission</div>` });
      return true;
    } else if (workResult.returnObject.ReturnCode === 1) {
      messageService.add({ key: 'tc', life: 1000, severity: 'success', summary: `Successful Add Operation` });
      return true;
    } else if (workResult.returnObject.ReturnCode === 2) {
      messageService.add({ key: 'tc', life: 1000, severity: 'success', summary: `Successful Edit Operation` });
      return true;
    } else if (workResult.returnObject.ReturnCode === 3) {
      messageService.add({ key: 'tc', life: 1000, severity: 'success', summary: `Successful Delete Operation` });
      return true;
    }
  }

  static handleErrors<T>(workResult: WorkResult<T>, messageService: MessageService): boolean {
    if (workResult.isCodeException) {
      let errorMessages = '';
      if (workResult.returnMessages && workResult.returnMessages.length > 0) {
        workResult.returnMessages.forEach(message => {
          errorMessages = `<div>${message}</div>`;
        });
      }
      messageService.add({
        key: 'tc', life: 5000, severity: 'error', summary: `Error Message`,
        detail: `<h4><strong>${errorMessages}</strong></h4>`
      });
      return true;
    }
  }
}

import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modals: IModal[] = [];
  // visible = false;

  constructor() {}

  register(id: string) {
    this.modals.push({
      id,
      visible: false,
    });
  }

  unregister(id: string) {
    this.modals = this.modals.filter(e => e.id !== id);
  }

  isModalOpen(id: string) : Boolean {
    return !!this.modals.find(e => e.id === id)?.visible;
  }

  toggleModal(id: string) {
    const modal = this.modals.find(e=> e.id === id);

    if(modal){
      modal.visible = !modal.visible;
    }
  }
}

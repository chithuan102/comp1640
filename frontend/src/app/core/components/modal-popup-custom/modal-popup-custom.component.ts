import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-modal-popup-custom',
    styleUrls: ['./modal-popup-custom.component.scss'],
    templateUrl: './modal-popup-custom.component.html',
    providers: [BsModalService],
})
export class ModalPopupCustomComponent implements OnInit, AfterViewInit, OnDestroy {
    protected onModalHideSubscription!: Subscription;
    bsModalRef!: BsModalRef;
    @ViewChild('templateModal', { static: true }) templateModal!: TemplateRef<any>;

    @Input() modalObject: any = {
        id: 'modalId',
        class: 'modal-custom-super-lg modal-dialog-centered  myCustomClass',
        title: 'Creating Form',
        headerClass: 'myClass',
        textCancel: 'Cancel',
        textConfirm: 'Submit',
        hideFooter: false,
        ignoreBackdropClick: false,
        confirm: () => {},
        cancel: () => {
            this.modalObject.hide();
        },
        buttons: [
            {
                title: 'More button',
                class: 'btn btn-primary',
                action: () => {},
            },
        ],
        showBtnDemo: true,
    };

    constructor(private modalService: BsModalService) {}

    ngOnInit() {
        if (this.modalObject) {
            this.modalObject.show = () => {
                this.bsModalRef = this.modalService.show(this.templateModal, {
                    backdrop: true,
                    ignoreBackdropClick:
                        this.modalObject.ignoreBackdropClick !== undefined
                            ? this.modalObject.ignoreBackdropClick
                            : true,
                    class: this.modalObject.class || 'modal-custom-md',
                });
            };
            this.modalObject.hide = () => {
                if (typeof this.bsModalRef !== 'undefined') {
                    this.bsModalRef.hide();
                }
            };
        }
    }

    ngAfterViewInit() {
        if (this.modalObject) {
            this.modalObject.show = () => {
                this.bsModalRef = this.modalService.show(this.templateModal, {
                    backdrop: true,
                    ignoreBackdropClick:
                        this.modalObject.ignoreBackdropClick !== undefined
                            ? this.modalObject.ignoreBackdropClick
                            : true,
                    class: this.modalObject.class || 'modal-custom-md',
                });
            };
            this.modalObject.hide = () => {
                if (typeof this.bsModalRef !== 'undefined') {
                    this.bsModalRef.hide();
                }
            };
            this.onModalHideSubscription = this.modalService.onHide.subscribe(
                (dismissReason: any) => {
                    if (!this.modalObject.cancel) {
                        return;
                    }
                    this.modalObject.cancel(this.bsModalRef, dismissReason);
                }
            );
        }
    }

    showModal() {
        this.bsModalRef = this.modalService.show(this.templateModal, {
            backdrop: true,
            ignoreBackdropClick:
                this.modalObject.ignoreBackdropClick !== undefined
                    ? this.modalObject.ignoreBackdropClick
                    : true,
            class: this.modalObject.class || 'modal-custom-md',
        });
        if (typeof this.modalObject.show === 'function') {
            // this.modalObject.show();
        }
    }

    hideModal() {
        if (typeof this.bsModalRef !== 'undefined') {
            this.bsModalRef.hide();
        }
        // if (typeof this.modalObject.hide === 'function') {
        // this.modalObject.hide();
        // }
    }

    ngOnDestroy(): void {
        if (this.onModalHideSubscription) {
            this.onModalHideSubscription.unsubscribe();
        }
    }
}

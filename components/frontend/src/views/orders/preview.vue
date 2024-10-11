<script setup>
import { onMounted, ref } from 'vue';
import '@/assets/sass/apps/invoice-preview.scss';

import { useMeta } from '@/composables/use-meta';

import { useStore } from 'vuex';
const store = useStore();

import { useRoute } from 'vue-router';
useMeta({ title: 'Заказ на сборку' });

import { Modal } from 'bootstrap';

let trackNumberModal = null;
const trackNumberModalRef = ref(null)
const initTrackNumberModal = () => {
    trackNumberModal = new Modal(trackNumberModalRef.value)
};

let commentForManagerModal = null;
const commentForManagerModalRef = ref(null)
const initcommentForManagerModal = () => {
    commentForManagerModal = new Modal(commentForManagerModalRef.value)
};

let commentForAssemblerModal = null;
const commentForAssemblerModalRef = ref(null)
const initcommentForAssemblerModal = () => {
    commentForAssemblerModal = new Modal(commentForAssemblerModalRef.value)
};

let commentForPickerModal = null;
const commentForPickerModalRef = ref(null)
const initcommentForPickerModal = () => {
    commentForPickerModal = new Modal(commentForPickerModalRef.value)
};

const route = useRoute();

const columns = ref([]);
const trackNumber = ref(null)

onMounted(() => {
    bind_data();
    initTrackNumberModal();
    initcommentForManagerModal();
    initcommentForAssemblerModal();
    initcommentForPickerModal();
});
const bind_data = () => {
    store.dispatch('orders/fetchById', { id: route.query.id })
    columns.value = [
        { key: 'sku', label: 'Артикул' },
        { key: 'title', label: 'Наименование' },
        { key: 'size', label: 'Размер', },
        { key: 'side', label: 'Сторона', },
        { key: 'material', label: 'Материал' },
        { key: 'color', label: 'Цвет', },
        { key: 'price', label: 'Цена', },
        { key: 'status', label: 'Статус', },
    ];
};

const print = () => {
    window.print();
};

const setItemDone = (item_id) => {
    store.dispatch(
        'orders/setOrderItemDone',
        { id: item_id, status: 'assembled' },
    ).then(
        store.dispatch('orders/fetchById', { id: route.query.id })
    )
}

const add_track_number = () => {
    store.dispatch('orders/set_track_number', {
        "id": store.state.orders.order.id,
        "delivery_tracking_number": trackNumber.value
    }).then(
        () => {
            trackNumberModal.hide();
            const toast = window.Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                padding: '2em'
            });
            toast.fire({
                icon: 'success',
                title: `Трек-номер добавлен`,
                padding: '2em'
            });
        }
    )//.then(() => store.dispatch('orders/fetchFilter', assembler_filter))
};

const update_comment_for_manager = () => {
    store.dispatch('orders/partial_update', {
        "id": store.state.orders.order.id,
        payload: {
            "comment_for_manager": store.state.orders.order.comment_for_manager
        }
    }).then(
        () => {
            commentForManagerModal.hide();
            const toast = window.Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                padding: '2em'
            });
            toast.fire({
                icon: 'success',
                title: `Комментарий обновлен`,
                padding: '2em'
            });
        }
    )//.then(() => store.dispatch('orders/fetchFilter', assembler_filter))
};

const update_comment_for_assembler = () => {
    store.dispatch('orders/partial_update', {
        "id": store.state.orders.order.id,
        payload: {
            "comment_for_assembler": store.state.orders.order.comment_for_assembler
        }
    }).then(
        () => {
            commentForAssemblerModal.hide();
            const toast = window.Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                padding: '2em'
            });
            toast.fire({
                icon: 'success',
                title: `Комментарий обновлен`,
                padding: '2em'
            });
        }
    )//.then(() => store.dispatch('orders/fetchFilter', assembler_filter))
};

const update_comment_for_picker = () => {
    store.dispatch('orders/partial_update', {
        "id": store.state.orders.order.id,
        payload: {
            "comment_for_picker": store.state.orders.order.comment_for_picker
        },
    }).then(
        () => {
            commentForPickerModal.hide();
            const toast = window.Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                padding: '2em'
            });
            toast.fire({
                icon: 'success',
                title: `Комментарий обновлен`,
                padding: '2em'
            });
        }
    )//.then(() => store.dispatch('orders/fetchFilter', assembler_filter))
};

const finish_order = () => {
    store.dispatch('orders/finish_order', {
        "id": store.state.orders.order.id,
        "status": "completed"
    }).then(
        () => {
            const toast = window.Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                padding: '2em'
            });
            toast.fire({
                icon: 'success',
                title: `Заказ завершен`,
                padding: '2em'
            });
        }
    )//.then(() => store.dispatch('orders/fetchFilter', assembler_filter))
};

</script>

<template>
    <div class="layout-px-spacing">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="javascript:;">Заказы</a></li>
                                <li class="breadcrumb-item">
                                    <router-link to="/orders/list" class="breadcrumb-item">
                                        Список
                                    </router-link>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page"><span>Подробно</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <div class="row invoice layout-top-spacing layout-spacing apps-invoice">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div class="doc-container">
                    <div class="row">
                        <div class="col-xl-10">
                            <div class="invoice-container">
                                <div class="invoice-inbox">
                                    <div id="ct" class="">
                                        <div class="invoice-00001">
                                            <div class="content-section">
                                                <div class="inv--head-section inv--detail-section mb-0">
                                                    <div class="row">
                                                        <div class="col-sm-6 col-12 me-auto">
                                                            <p class="inv-list-number">
                                                                <span class="h1">Заказ :</span>
                                                                <span class="h1">
                                                                    {{ store.state.orders.order.number }}
                                                                </span>
                                                            </p>
                                                        </div>

                                                        <div class="col-sm-6 text-sm-end">
                                                            <div class="">
                                                                <img class="invoice-logo"
                                                                    src="@/assets/images/full_logo.svg" alt="company" />
                                                            </div>
                                                        </div>
                                                        <div v-if="store.state.orders.order.customer"
                                                            class="col-sm-8 align-self-center pt-5">
                                                            <p class="inv-created-date">
                                                                <span class="inv-title">Заказчик : </span>
                                                                <span class="inv-date">
                                                                    {{ store.state.orders.order.customer.name }}
                                                                </span>
                                                            </p>
                                                            <p class="inv-created-date">
                                                                <span class="inv-title">Организация : </span>
                                                                <span class="inv-date">
                                                                    {{ store.state.orders.order.customer.organisation }}
                                                                </span>
                                                            </p>
                                                            <p class="inv-created-date">
                                                                <span class="inv-title">Адрес : </span>
                                                                <span class="inv-date">
                                                                    {{ store.state.orders.order.customer.address }}
                                                                </span>
                                                            </p>
                                                            <p class="inv-created-date">
                                                                <span class="inv-title">Телефон : </span>
                                                                <span class="inv-date">
                                                                    {{ store.state.orders.order.customer_phone }}
                                                                </span>
                                                            </p>
                                                            <p class="inv-created-date">
                                                                <span class="inv-title">Стоимость заказа : </span>
                                                                <span class="inv-date">
                                                                    {{ store.state.orders.order.total_cost }} руб.
                                                                </span>
                                                            </p>
                                                            <p class="inv-created-date">
                                                                <span class="inv-title">Стоимость изделий : </span>
                                                                <span class="inv-date">
                                                                    {{ store.state.orders.order.products_cost }} руб.
                                                                </span>
                                                            </p>
                                                            <p class="inv-created-date">
                                                                <span class="inv-title">Стоимость доставки : </span>
                                                                <span class="inv-date">
                                                                    {{ store.state.orders.order.delivery_cost }} руб.
                                                                </span>
                                                            </p>
                                                            <p class="inv-created-date">
                                                                <span class="inv-title">ТРЕК-номер : </span>
                                                                <span class="inv-date">
                                                                    {{ store.state.orders.order.delivery_tracking_number
                                                                    }}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div class="col-sm-4 align-self-start pt-5 text-sm-end">
                                                            <p v-if="store.state.orders.order.designer_user"
                                                                class="pb-3">
                                                                <span class="inv-subtitle">Дизайнер: </span>
                                                                <span>
                                                                    {{ store.state.orders.order.designer_user.name
                                                                    }}
                                                                </span>
                                                            </p>
                                                            <p>
                                                                <span>Статус заказа: </span>
                                                                <span>
                                                                    {{ store.state.orders.order.status }}
                                                                </span>
                                                            </p>
                                                            <p>
                                                                <span>Приоритет: </span>
                                                                <span>
                                                                    {{ store.state.orders.order.priority }}
                                                                </span>
                                                            </p>
                                                            <p v-if="store.state.orders.order.created_by" class="pt-3">
                                                                <span>Менеджер: </span>
                                                                <span>
                                                                    {{ store.state.orders.order.manager_user.full_name
                                                                    }}
                                                                </span>
                                                            </p>
                                                            <p v-if="store.state.orders.order.assembler" class="pt-3">
                                                                <span class="inv-subtitle">Сборщик: </span>
                                                                <span>
                                                                    {{ store.state.orders.order.assembler_user.full_name
                                                                    }}
                                                                </span>
                                                            </p>
                                                            <p v-if="store.state.orders.order.assembling_start">
                                                                <span class="inv-subtitle">Сборка начата: </span>
                                                                <span>
                                                                    {{
                                                                        store.state.orders.order.assembling_start.toLocaleDateString('ru-RU')
                                                                    }}
                                                                </span>
                                                            </p>
                                                            <p v-if="store.state.orders.order.assembling_end">
                                                                <span class="inv-subtitle">Сборка завершена: </span>
                                                                <span class="text-bold">
                                                                    {{
                                                                        store.state.orders.order.assembling_end.toLocaleDateString('ru-RU')
                                                                    }}
                                                                </span>
                                                            </p>
                                                            <p v-if="store.state.orders.order.picker" class="pt-3">
                                                                <span class="inv-subtitle">Упаковщик: </span>
                                                                <span>
                                                                    {{ store.state.orders.order.picker_user.full_name
                                                                    }}
                                                                </span>
                                                            </p>
                                                            <p v-if="store.state.orders.order.shipped_at">
                                                                <span class="inv-subtitle">Отправлен: </span>
                                                                <span>
                                                                    {{
                                                                        store.state.orders.order.shipped_at.toLocaleDateString('ru-RU')
                                                                    }}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="inv--product-table-section pt-0">
                                                    <div class="table-responsive">
                                                        <table class="table table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th>
                                                                        Комментарий для менеджера
                                                                    </th>
                                                                    <th>
                                                                        Комментарий для сборщика
                                                                    </th>
                                                                    <th>
                                                                        Комментарий для упаковщика
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        {{ store.state.orders.order.comment_for_manager
                                                                        }}
                                                                    </td>
                                                                    <td>
                                                                        {{
                                                                            store.state.orders.order.comment_for_assembler
                                                                        }}
                                                                    </td>
                                                                    <td>
                                                                        {{ store.state.orders.order.comment_for_picker
                                                                        }}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <div class="inv--product-table-section">
                                                    <div class="table-responsive">
                                                        <table class="table table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th v-for="item in columns" :key="item.key"
                                                                        :class="[item.class]">
                                                                        {{ item.label }}
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-for="item in store.state.orders.order.items"
                                                                    :key="item.id">
                                                                    <td>
                                                                        {{ item.product.sku }}
                                                                    </td>
                                                                    <td>
                                                                        {{ item.product.title }}
                                                                    </td>
                                                                    <td>
                                                                        {{ item.product.size }}
                                                                    </td>
                                                                    <td>
                                                                        {{ item.product.side }} - {{
                                                                            item.product.side_point
                                                                        }}
                                                                    </td>
                                                                    <td>
                                                                        {{ item.product.material.title }}
                                                                    </td>
                                                                    <td>
                                                                        {{ item.product.color.title }}
                                                                    </td>
                                                                    <td>
                                                                        {{ item.product.price }} руб.
                                                                    </td>
                                                                    <td>
                                                                        {{ item.status_name }}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-xl-2">
                            <div class="invoice-actions-btn">
                                <div class="invoice-action-btn">
                                    <div class="row">
                                        <div class="col-xl-12 col-md-3 col-sm-6">
                                            <a href="javascript:;" class="btn btn-secondary btn-print action-print"
                                                @click="print()">Печать</a>
                                        </div>
                                        <div class="btn-group custom-dropdown mb-4 me-2" role="group">
                                            <button id="btnOutline" type="button"
                                                class="btn btn-outline-primary dropdown-toggle"
                                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Комментарии
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                    class="feather feather-chevron-down">
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                </svg>
                                            </button>
                                            <ul class="dropdown-menu" aria-labelledby="btndefault">
                                                <li @click="commentForManagerModal.show()">
                                                    <a href="javascript:;" class="dropdown-item"><i
                                                            class="flaticon-home-fill-1 me-1"></i>Менеджер</a>
                                                </li>
                                                <li @click="commentForAssemblerModal.show()">
                                                    <a href="javascript:;" class="dropdown-item"><i
                                                            class="flaticon-gear-fill me-1"></i>Сборщик</a>
                                                </li>
                                                <li @click="commentForPickerModal.show()">
                                                    <a href="javascript:;" class="dropdown-item"><i
                                                            class="flaticon-bell-fill-2 me-1"></i>Упаковщик</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div v-if="store.state.orders.order.status == 'Отправлен'"
                                            class="col-xl-12 col-md-3 col-sm-6" @click="trackNumberModal.show()">
                                            <a href="javascript:;" class="btn btn-success btn-send">Трек-номер</a>
                                        </div>
                                        <div v-if="store.state.orders.order.status == 'Отправлен'"
                                            class="col-xl-12 col-md-3 col-sm-6" @click="finish_order()">
                                            <a href="javascript:;" class="btn btn-info btn-send">Завершить</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" ref="commentForManagerModalRef" tabindex="-1" role="dialog"
            aria-labelledby="commentForManagerModalRef" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="commentForManagerModalRef">Комментарий для менеджера</h5>
                        <button type="button" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close"
                            class="btn-close"></button>
                    </div>
                    <div class="modal-body">
                        <label class="col-form-label" for="commentForManager">Комментарий для менеджера</label>
                        <textarea rows="8" v-model="store.state.orders.order.comment_for_manager" type="text"
                            class="form-control" placeholder="Комментарий для менеджера" id="commentForManager" />
                        <div class="modal-footer">
                            <button type="button" class="btn" data-dismiss="modal" data-bs-dismiss="modal"><i
                                    class="flaticon-cancel-12"></i>Отмена</button>
                            <button type="button" class="btn btn-primary" @click.prevent="update_comment_for_manager">
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" ref="commentForAssemblerModalRef" tabindex="-1" role="dialog"
            aria-labelledby="commentForAssemblerModalRef" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="commentForAssemblerModalRef">Комментарий для сборщика</h5>
                        <button type="button" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close"
                            class="btn-close"></button>
                    </div>
                    <div class="modal-body">
                        <label class="col-form-label" for="commentForAssembler">Комментарий для сборщика</label>
                        <textarea rows="8" v-model="store.state.orders.order.comment_for_assembler" type="text"
                            class="form-control" placeholder="Комментарий для сборщика" id="commentForAssembler" />
                        <div class="modal-footer">
                            <button type="button" class="btn" data-dismiss="modal" data-bs-dismiss="modal"><i
                                    class="flaticon-cancel-12"></i>Отмена</button>
                            <button type="button" class="btn btn-primary" @click.prevent="update_comment_for_assembler">
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" ref="commentForPickerModalRef" tabindex="-1" role="dialog"
            aria-labelledby="commentForPickerModalRef" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="commentForPickerModalRef">Комментарий для упаковщика</h5>
                        <button type="button" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close"
                            class="btn-close"></button>
                    </div>
                    <div class="modal-body">
                        <label class="col-form-label" for="commentForPicker">Комментарий для упаковщика</label>
                        <textarea rows="8" v-model="store.state.orders.order.comment_for_picker" type="text"
                            class="form-control" placeholder="Комментарий для упаковщика" id="commentForPicker" />
                        <div class="modal-footer">
                            <button type="button" class="btn" data-dismiss="modal" data-bs-dismiss="modal"><i
                                    class="flaticon-cancel-12"></i>Отмена</button>
                            <button type="button" class="btn btn-primary" @click.prevent="update_comment_for_picker">
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" ref="trackNumberModalRef" tabindex="-1" role="dialog"
            aria-labelledby="trackNumberModalRef" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="trackNumberModalRef">Трек-номер</h5>
                        <button type="button" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close"
                            class="btn-close"></button>
                    </div>
                    <div class="modal-body">
                        <label class="col-form-label" for="trackNumber">Трек-номер</label>
                        <input v-model="trackNumber" type="text" class="form-control" placeholder="Трек-номер"
                            id="trackNumber" />
                        <div class="modal-footer">
                            <button type="button" class="btn" data-dismiss="modal" data-bs-dismiss="modal"><i
                                    class="flaticon-cancel-12"></i>Отмена</button>
                            <button type="button" class="btn btn-primary" @click.prevent="add_track_number">
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

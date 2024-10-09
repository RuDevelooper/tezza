<script setup>
import { onMounted, ref } from 'vue';
import '@/assets/sass/apps/invoice-add.scss';

import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import '@/assets/sass/forms/custom-flatpickr.css';

import { useMeta } from '@/composables/use-meta';
import { useStore } from 'vuex';

import { useRouter } from 'vue-router';
const router = useRouter();

import Multiselect from 'vue-multiselect'

useMeta({ title: 'Новый заказ' });


import { Modal } from 'bootstrap';

let indiItemModal = null;
const indiItemModalRef = ref(null)
const initIndiItemModalRef = () => {
    indiItemModal = new Modal(indiItemModalRef.value)
};

const store = useStore();

const items = ref([]);

const created_at = ref(null);
const due_date = ref(null);
const designer = ref(null);
const order = ref({
    number: '',

    customer: { name: '', organisation: '', phone: '' },
    delivery: { address: '', carrier: '', cost: 0 },
    cost: { items: '', carrier: '' },
    notes: { manager: '', assembler: '', picker: '' },

    created_at: '',
    due_date: '',
});

const products = ref([]);
const default_item_values = {
    sku: '',
    title: '',
    quantity: 1,
    material: '',
    side: '',
    color: '',
    price: 0,
}
onMounted(() => {
    items.value.push({ 'item': { id: 1, ...default_item_values } });
    let dt = new Date();
    created_at.value = new Date();
    dt.setDate(dt.getDate() + 15);
    dt.setHours(0, 0, 0, 0);
    due_date.value = dt;
    store.dispatch('materials/fetchItems')
    store.dispatch('colors/fetchItems')
    store.dispatch('designers/fetchItems')
    // store.dispatch('sides/fetchItems')

    initIndiItemModalRef()


});

const add_item = () => {
    let max_id = 0;
    if (items.value && items.value.length) {
        max_id = items.value.reduce(
            (max, character) => (character.id > max ? character.id : max), items.value[0].id
        );
    }
    items.value.push({ 'item': { id: max_id + 1, ...default_item_values } });
};
const add_indi_item = (item) => {
    let max_id = 0;
    if (items.value && items.value.length) {
        max_id = items.value.reduce(
            (max, character) => (character.id > max ? character.id : max), items.value[0].id
        );
    }
    items.value.push({
        'item': {
            id: max_id + 1,
            sku: item.sku,
            title: item.title,
            quantity: 1,
            material: item.material,
            side: item.side,
            color: item.color,
            price: item.price,
        }
    });
};

const remove_item = (item) => {
    items.value = items.value.filter((d) => d.item.id != item.id);
};

const createdAtHandler = (selectedDates) => {
    order.value.created_at = selectedDates[0];
}

const dueDateHandler = (selectedDates) => {
    order.value.due_date = selectedDates[0];
}

const create_order = () => {

    var product_cost = items.value.reduce((acc, x) => acc + (x.item.price * x.item.quantity), 0);

    let order_items = []
    for (var item of items.value) {
        for (let i = 0; i < item.item.quantity; i++) {
            order_items.push({
                product: {
                    sku: item.item.sku,
                    title: item.item.title,
                    material: item.item.material.id,
                    side: item.item.side,
                    color: item.item.color.id,
                },
                price: item.item.price,
            });
        }

    }

    store.dispatch('orders/create', {
        number: order.value.number,
        customer: {
            organisation: order.value.customer.organisation,
            name: order.value.customer.name,
            address: order.value.delivery.address,
            phone: order.value.customer.phone,
        },
        items: order_items,
        created_at: order.value.created_at,
        due_date: order.value.due_date,
        products_cost: product_cost,
        designer: designer.value,
        delivery_cost: order.value.delivery.cost,
        total_cost: product_cost + order.value.delivery.cost,
        created_by: store.state.auth.user.id,
        comment_for_manager: order.value.notes.manager,
        comment_for_assembler: order.value.notes.assembler,
        comment_for_picker: order.value.notes.picker,
    }).then((res) => {
        const toast = window.Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            padding: '2em'
        });
        toast.fire({
            icon: 'success',
            title: `Заказ № ${res.data.number} создан`,
            padding: '2em'
        });
        router.push('/orders/list')
    }).catch((error) => {
        new window.Swal('Ошибка!', error.message, 'error')
    });
};
const product = ref({})
const indiProduct = ref({
    sku: null,
    title: null,
    color: null,
    material: null,
    side: null,
    side_point: null,
    size: null,
    price: null,
})
const openIndiProductModal = () => {
    indiProduct.value.sku = "INDI-" + order.value.number;
    indiItemModal.show();
}

const findProducts = (query, _) => {
    if (query.length < 2) return;

    store.dispatch('products/find', query)
}

import { VueDadata } from 'vue-dadata';
import 'vue-dadata/dist/style.css';

let dadataToken = process.env.VITE_APP_DADATA_API_KEY

const add_indi_product = () => {
    store.dispatch('products/create', {
        sku: indiProduct.value.sku,
        title: indiProduct.value.title,
        color: indiProduct.value.color,
        material: indiProduct.value.material,
        side: indiProduct.value.side,
        side_point: indiProduct.value.side_point,
        size: indiProduct.value.size,
        price: indiProduct.value.price,
    }).then((res) => {
        console.log(res.data)
        add_indi_item(res.data)
        indiItemModal.hide()
        const toast = window.Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            padding: '2em'
        });
        toast.fire({
            icon: 'success',
            title: `Индивидуальное изделие с артикулом ${res.data.sku} создано`,
            padding: '2em'
        });
    }).catch((error) => {
        new window.Swal('Ошибка!', error.message, 'error')
    });
}

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.multiselect__option--highlight {
    background: #fff;
    color: #4361ee;
}

.multiselect__option--selected {
    background-color: rgba(27, 85, 226, 0.23921568627450981);
    color: #4361ee;
    font-weight: normal;
}

.multiselect__option--disabled {
    background: inherit !important;
}

.multiselect__tag {
    color: #000;
    background: #e4e4e4;
}

.multiselect__tag-icon:after {
    color: #000 !important;
}

.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
    background: inherit;
}
</style>
<template>
    <div class="layout-px-spacing apps-invoice-add">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="javascript:;">Заказы</a></li>
                                <li class="breadcrumb-item"><router-link to="/orders/list"
                                        class="breadcrumb-item">Список</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page"><span>Новый</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <div class="row invoice layout-top-spacing layout-spacing">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div class="doc-container">
                    <div class="row">
                        <div class="col-xl-9">
                            <div class="invoice-content">
                                <div class="invoice-detail-body">
                                    <div class="invoice-detail-title mb-3">

                                        <div class="invoice-title">

                                            <h5 for="currency">Новый заказ</h5>
                                        </div>
                                    </div>

                                    <div class="invoice-detail-header">
                                        <div class="row justify-content-between">
                                            <div class="col-md-3">
                                                <div class="form-group mb-4">
                                                    <label for="number">Номер заказа</label>
                                                    <input type="text" v-model="order.number" id="number"
                                                        class="form-control form-control-sm"
                                                        placeholder="Введите номер" />
                                                </div>
                                            </div>

                                            <div class="col-md-3">
                                                <div class="form-group mb-4">
                                                    <label for="date">Дата заказа</label>
                                                    <flat-pickr v-model="created_at" @on-change="createdAtHandler"
                                                        class="form-control form-control-sm flatpickr active"
                                                        placeholder="Дата заказа"></flat-pickr>
                                                </div>
                                            </div>

                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="due">Плановая отгрузка</label>
                                                    <flat-pickr v-model="due_date" @on-change="dueDateHandler"
                                                        class="form-control form-control-sm flatpickr active"
                                                        placeholder="Due Date"></flat-pickr>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="invoice-detail-terms mt-0 mb-4">
                                        <div class="row justify-content-between">
                                            <div class="col-xl-5 invoice-address-company">
                                                <h4>Покупатель:</h4>

                                                <div class="invoice-address-company-fields">
                                                    <div class="form-group row">
                                                        <label for="customer-name"
                                                            class="col-sm-3 col-form-label col-form-label-sm">ФИО</label>
                                                        <div class="col-sm-9">
                                                            <input type="text" v-model="order.customer.name"
                                                                id="customer-name" class="form-control form-control-sm"
                                                                placeholder="Фамилия Имя Отчество" />
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label for="company-name"
                                                            class="col-sm-3 col-form-label col-form-label-sm">ИП /
                                                            ООО</label>
                                                        <div class="col-sm-9">
                                                            <input type="text" v-model="order.customer.organisation"
                                                                id="company-name" class="form-control form-control-sm"
                                                                placeholder="Название компании-покупателя" />
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label for="phone"
                                                            class="col-sm-3 col-form-label col-form-label-sm">Телефон</label>
                                                        <div class="col-sm-9">
                                                            <input type="text" v-model="order.customer.phone" id="phone"
                                                                class="form-control form-control-sm"
                                                                placeholder="(123) 456 789" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-xl-5 invoice-address-client">
                                                <h4>Доставка:</h4>

                                                <div class="invoice-address-client-fields">

                                                    <div class="form-group row">
                                                        <label for="company-address"
                                                            class="col-sm-3 col-form-label col-form-label-sm">Адрес</label>
                                                        <div class="col-sm-9">
                                                            <input type="text" v-model="order.delivery.address"
                                                                id="company-address"
                                                                class="form-control form-control-sm"
                                                                placeholder="Адрес" />
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label for="delivery"
                                                            class="col-sm-3 col-form-label col-form-label-sm">ТК</label>
                                                        <div class="col-sm-9">
                                                            <input type="text" v-model="order.delivery.carrier"
                                                                id="delivery" class="form-control form-control-sm"
                                                                placeholder="Транспортная компания" />
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label for="total-cost"
                                                            class="col-sm-3 col-form-label col-form-label-sm">Стоимость</label>
                                                        <div class="col-sm-9">
                                                            <input type="number" v-model="order.delivery.cost"
                                                                id="total-cost" class="form-control form-control-sm"
                                                                placeholder="Стоимость" />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="invoice-detail-terms mt-0 mb-4">
                                        <div class="row justify-content-between">
                                            <div class="col-md-5">
                                                <div class="form-group mb-4">
                                                    <label for="designer" class="pb-1">Дизайнер</label>
                                                    <select v-model="designer" class="form-select form-select"
                                                        id="designer">
                                                        <option v-for="d in store.state.designers.designers" :key="d.id"
                                                            :value="d.id">
                                                            {{ d.name }}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class="col-md-5 text-end pt-4">
                                                <button :disabled="!order.number" type="button"
                                                    class="btn btn-outline-info" @click="openIndiProductModal()"
                                                    data-bs-toggle="tooltip"
                                                    title="Для добавления изделия нужно ввести номер заказа">
                                                    Добавить индивидуальное изделие
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="invoice-detail-items">
                                        <div class="table-responsive">
                                            <table class="table table-bordered item-table">
                                                <thead>
                                                    <tr>
                                                        <th class=""></th>
                                                        <th>Артикул / Наименование / Размер</th>
                                                        <th class="">Характеристики</th>
                                                        <th class="">Количество / Цена</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(good, index) in items" :key="index">
                                                        <td class="delete-item-row">
                                                            <ul class="table-controls">
                                                                <li>
                                                                    <a href="javascript:void(0);" class="delete-item"
                                                                        @click="remove_item(good.item)">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                            width="24" height="24" viewBox="0 0 24 24"
                                                                            fill="none" stroke="currentColor"
                                                                            stroke-width="2" stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            class="feather feather-x-circle">
                                                                            <circle cx="12" cy="12" r="10"></circle>
                                                                            <line x1="15" y1="9" x2="9" y2="15"></line>
                                                                            <line x1="9" y1="9" x2="15" y2="15"></line>
                                                                        </svg>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </td>
                                                        <td class="name">
                                                            <div class="w100">
                                                                <multiselect v-model="good.item" id="orderItemSku"
                                                                    :options="store.state.products.bySku"
                                                                    :searchable="true" :showNoOptions="true"
                                                                    noOptions="Начните вводить артикул"
                                                                    selected-label="sku" select-label=""
                                                                    deselect-label="" placeholder="Артикул.."
                                                                    track-by="sku" label="sku"
                                                                    @search-change="findProducts">
                                                                    <template #noOptions>
                                                                        <span>Введите 2 и более символов</span>
                                                                    </template>
                                                                    <template #noResult>
                                                                        <span>Артикулов подходящих по фильтру нет</span>
                                                                    </template>
                                                                </multiselect>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-xl-9 col-sm-12 pe-1">
                                                                    <input v-model="good.item.title"
                                                                        class="form-control px-3 mt-1"
                                                                        placeholder="Наименование" disabled />
                                                                </div>
                                                                <div class="col-xl-3 col-sm-12 ps-0">
                                                                    <input v-model="good.item.size"
                                                                        class="form-control px-3 mt-1"
                                                                        placeholder="Размер" disabled />
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td class="text-end material">
                                                            <input v-model="good.item.material.title"
                                                                class="form-control form-control mb-1" id="material"
                                                                placeholder="Материал" disabled />

                                                            <input v-model="good.item.color.title"
                                                                class="form-control form-control mb-1" id="side"
                                                                placeholder="Цвет" disabled />

                                                            <input v-model="good.item.side"
                                                                class="form-control form-control" id="color"
                                                                placeholder="Сторона" disabled />
                                                        </td>
                                                        <td class="text-end qty">
                                                            <input type="number" v-model="good.item.price"
                                                                class="form-control form-control mb-1"
                                                                placeholder="Цена" disabled />
                                                            <input type="number" v-model="good.item.quantity"
                                                                class="form-control form-control"
                                                                placeholder="Количество" />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <button type="button" class="btn btn-secondary additem btn-sm"
                                            @click="add_item()">Добавить изделие</button>
                                    </div>
                                    <div class="invoice-detail-total">
                                        <div class="row">

                                            <div class="col-md-6 ms-auto">
                                                <div class="totals-row">
                                                    <div class="invoice-totals-row invoice-summary-subtotal">
                                                        <div class="invoice-summary-label">Изделия</div>
                                                        <div class="invoice-summary-value">
                                                            <div class="subtotal-amount"><span class="currency">₽
                                                                </span><span class="amount">
                                                                    {{ items.reduce((acc, x) => acc + (x.item.price *
                                                                        x.item.quantity), 0) }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="invoice-totals-row invoice-summary-total">
                                                        <div class="invoice-summary-label">Доставка</div>
                                                        <div class="invoice-summary-value">
                                                            <div class="total-amount"><span class="currency">₽
                                                                </span><span class="amount">{{ order.delivery.cost
                                                                    }}</span></div>
                                                        </div>
                                                    </div>
                                                    <div class="invoice-totals-row invoice-summary-balance-due">
                                                        <div class="invoice-summary-label">Итого</div>
                                                        <div class="invoice-summary-value">
                                                            <div class="balance-due-amount"><span class="currency">₽
                                                                </span>
                                                                <span class="amount">
                                                                    {{ items.reduce((acc, x) => acc + (x.item.price *
                                                                        x.item.quantity),
                                                                        0) + order.delivery.cost }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-xl-3">
                            <div class="invoice-actions">
                                <div class="invoice-action-currency">
                                    <label for="invoice-detail-notes"
                                        class="col-sm-12 col-form-label col-form-label-sm">
                                        Комментарий для менеджера:
                                    </label>
                                    <div class="col-sm-12 px-4">
                                        <textarea v-model="order.notes.manager" rows="8" id="invoice-detail-notes"
                                            class="form-control" placeholder='Комментарий для менеджера'></textarea>
                                    </div>
                                </div>

                                <div class="invoice-action-tax">
                                    <h5>Комментарий для сборщика</h5>

                                    <div class="invoice-action-tax-fields">
                                        <div class="form-group mb-0">
                                            <div class="col-sm-12">
                                                <textarea v-model="order.notes.assembler" rows="8"
                                                    id="invoice-detail-notes" class="form-control"
                                                    placeholder='Комментарий для сборщика'></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="invoice-action-tax">
                                    <h5>Комментарий для упаковщика</h5>

                                    <div class="invoice-action-tax-fields">
                                        <div class="form-group mb-0">
                                            <div class="col-sm-12">
                                                <textarea v-model="order.notes.picker" rows="8"
                                                    id="invoice-detail-notes" class="form-control"
                                                    placeholder='Комментарий для упаковщика'></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="invoice-actions-btn">
                                <div class="invoice-action-btn">
                                    <div class="row">
                                        <div class="col-xl-12 col-md-4">
                                            <button type="button" class="btn btn-success w-100 mb-4 me-2"
                                                @click="create_order()">Сохранить
                                                заказ</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" ref="indiItemModalRef" tabindex="-1" role="dialog" aria-labelledby="indiItemModalRef"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="indiItemModalRef">Добавить индивидуальное изделие</h5>
                        <button type="button" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close"
                            class="btn-close"></button>
                    </div>
                    <div class="modal-body">
                        <form action="javascript:void(0);">
                            <div class="row">
                                <div class="col-xl-6 col-md-12">
                                    <div class="form-group mb-4">
                                        <label>Артикул</label>
                                        <input type="text" v-model="indiProduct.sku" class="form-control"
                                            placeholder="Артикул" />
                                    </div>
                                </div>
                                <div class="col-xl-6 col-md-12">
                                    <div class="form-group mb-4">
                                        <label>Размер, см</label>
                                        <input type="number" v-model="indiProduct.size" class="form-control"
                                            placeholder="Размер, см" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xl-12 col-md-12">
                                    <div class="form-group mb-4">
                                        <label>Наименование</label>
                                        <textarea type="text" v-model="indiProduct.title" class="form-control"
                                            placeholder="Наименование" maxlength="100" minlength="1" rows="3" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xl-6 col-md-6 col-sm-12">
                                    <label>Материал</label>
                                    <select v-model="indiProduct.material" class="form-select form-select"
                                        id="material">
                                        <option v-for="material in store.state.materials.materials" :value="material.id"
                                            :key="material.id">
                                            {{ material.title }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-xl-6 col-md-6 col-sm-12">
                                    <label>Цвет</label>
                                    <select v-model="indiProduct.color" class="form-select form-select" id="color">
                                        <option v-for="color in store.state.colors.colors" :value="color.id"
                                            :key="color.id">
                                            {{ color.title }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row py-4">
                                <div class="col-xl-6 col-md-6 col-sm-12">
                                    <label>Сторона</label>
                                    <select v-model="indiProduct.side" class="form-select form-select" id="side">
                                        <option value="Слева">Слева</option>
                                        <option value="Справа">Справа</option>
                                    </select>
                                </div>
                                <div class="col-xl-6 col-md-6 col-sm-12">
                                    <label>Признак для стороны</label>
                                    <input type="text" v-model="indiProduct.side_point" class="form-control"
                                        placeholder="Признак для стороны" />
                                </div>
                            </div>
                            <div class="row justify-content-end pb-5">
                                <div class="col-xl-6 col-md-6 col-sm-12">
                                    <label>Цена, руб.</label>
                                    <input type="number" v-model="indiProduct.price" class="form-control"
                                        placeholder="Цена, руб." />
                                </div>
                            </div>
                        </form>
                        <div class="modal-footer pb-0">
                            <button type="button" class="btn" data-dismiss="modal" data-bs-dismiss="modal"><i
                                    class="flaticon-cancel-12"></i>Отмена</button>
                            <button type="button" class="btn btn-primary" @click.prevent="add_indi_product">
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

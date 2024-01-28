<script setup>
import { onMounted, ref } from 'vue';
import '@/assets/sass/apps/invoice-preview.scss';

import { useMeta } from '@/composables/use-meta';

import { useStore } from 'vuex';
const store = useStore();

import { useRoute } from 'vue-router';
useMeta({ title: 'Заказ на сборку' });

const route = useRoute();

const columns = ref([]);

onMounted(() => {
    bind_data();
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
        // { key: 'priority', label: 'Приоритет', },
        { key: 'status', label: 'Статус', },
        { key: 'action', label: '', },
    ];
};

const print = () => {
    window.print();
};

const setItemDone = (item_id) => {
    console.log(item_id);
    store.dispatch(
        'orders/setOrderItemDone',
        { id: item_id, status: 'assembled' },
    ).then(
        store.dispatch('orders/fetchById', { id: route.query.id })
    )
}
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
                                    <router-link to="/assembler/orders" @click="toggleMobileMenu" class="breadcrumb-item">
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
                                                <div class="inv--head-section inv--detail-section">
                                                    <div class="row">
                                                        <div class="col-sm-6 col-12 me-auto">
                                                            <div class="d-flex">
                                                                <img class="invoice-logo"
                                                                    src="@/assets/images/full_logo.svg" alt="company" />
                                                            </div>
                                                        </div>

                                                        <div class="col-sm-6 text-sm-end">
                                                            <p class="inv-list-number">
                                                                <span class="h1">Заказ :</span>
                                                                <span class="h1">
                                                                    {{ store.state.orders.order.number }}
                                                                </span>
                                                            </p>
                                                        </div>

                                                        <div class="col-sm-6 align-self-center mt-3">
                                                            <p class="inv-street-addr">644105, Омск, ул. 4-я Челюскинцев, 1
                                                            </p>
                                                            <p class="inv-email-address">tezzazakaz@mail.ru</p>
                                                            <p class="inv-email-address">+7 (381) 229-02-62</p>
                                                        </div>
                                                        <div class="col-sm-6 align-self-center mt-3 text-sm-end">
                                                            <p class="inv-created-date">
                                                                <span class="inv-title">Дата заказа : </span>
                                                                <span class="inv-date">
                                                                    {{ store.state.orders.order.created_at_local_date }}
                                                                </span>
                                                            </p>
                                                            <p class="inv-due-date">
                                                                <span class="inv-title">Завершить сборку до : </span>
                                                                <span class="inv-date">
                                                                    {{
                                                                        store.state.orders.order.assembler_deadline_locale_date
                                                                    }}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="inv--detail-section inv--customer-detail-section">
                                                    <div class="row">
                                                        <div class="col-xl-8 col-lg-7 col-md-6 col-sm-4 align-self-center">
                                                            <p class="inv-to">Заказчик:</p>
                                                        </div>

                                                        <div
                                                            class="col-xl-4 col-lg-5 col-md-6 col-sm-8 align-self-center order-sm-0 order-1 inv--payment-info">
                                                            <h6 class="inv-title">Информация:</h6>
                                                        </div>

                                                        <div v-if="store.state.orders.order.customer"
                                                            class="col-xl-8 col-lg-7 col-md-6 col-sm-4">
                                                            <p class="inv-customer-name">
                                                                {{ store.state.orders.order.customer.name }}
                                                            </p>
                                                            <p class="inv-street-addr">
                                                                {{ store.state.orders.order.customer.organisation }}
                                                            </p>
                                                            <p class="inv-email-address">
                                                                {{ store.state.orders.order.customer.address }}
                                                            </p>
                                                            <p class="inv-email-address">
                                                                {{ store.state.orders.order.customer.phone }}
                                                            </p>
                                                        </div>

                                                        <div
                                                            class="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-12 order-sm-0 order-1">
                                                            <div class="inv--payment-info">
                                                                <p>
                                                                    <span class="inv-subtitle">Статус заказа:</span>
                                                                    <span>
                                                                        {{ store.state.orders.order.status }}
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span class="inv-subtitle">Приоритет: </span>
                                                                    <span>
                                                                        {{ store.state.orders.order.priority }}
                                                                    </span>
                                                                </p>
                                                                <p v-if="store.state.orders.order.created_by">
                                                                    <span class="inv-subtitle">Менеджер:</span>
                                                                    <span>
                                                                        {{ store.state.orders.order.created_by.name }}
                                                                    </span>
                                                                </p>
                                                                <p v-if="store.state.orders.order.assembler">
                                                                    <span class="inv-subtitle">Сборщик: </span>
                                                                    <span>
                                                                        {{ store.state.orders.order.assembler.name }}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
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
                                                                        {{ item.product.side }} - {{ item.product.side_point
                                                                        }}
                                                                    </td>
                                                                    <td>
                                                                        {{ item.product.material.title }}
                                                                    </td>
                                                                    <td>
                                                                        {{ item.product.color.title }}
                                                                    </td>
                                                                    <!-- <td>
                                                                        {{ item.priority }}
                                                                    </td> -->
                                                                    <td>
                                                                        {{ item.status_name }}
                                                                    </td>
                                                                    <td aria-colindex="5" role="cell" class="text-center"
                                                                        color="success" @click="setItemDone(item.id)">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                            height="24" viewBox="0 0 24 24" fill="none"
                                                                            stroke="currentColor" stroke-width="2"
                                                                            stroke-linecap="round" stroke-linejoin="round"
                                                                            class="feather feather-check-square t-icon done-hover-icon"
                                                                            data-v-02c2cbc4="">
                                                                            <polyline points="9 11 12 14 22 4"></polyline>
                                                                            <path
                                                                                d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11">
                                                                            </path>
                                                                        </svg>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <!-- <div class="inv--total-amounts">
                                                    <div class="row mt-4">
                                                        <div class="col-sm-5 col-12 order-sm-0 order-1"></div>
                                                        <div class="col-sm-7 col-12 order-sm-1 order-0">
                                                            <div class="text-sm-end">
                                                                <div class="row">
                                                                    <div class="col-sm-8 col-7">
                                                                        <p class="">Sub Total:</p>
                                                                    </div>
                                                                    <div class="col-sm-4 col-5">
                                                                        <p class="">$3155</p>
                                                                    </div>
                                                                    <div class="col-sm-8 col-7">
                                                                        <p class="">Tax Amount:</p>
                                                                    </div>
                                                                    <div class="col-sm-4 col-5">
                                                                        <p class="">$700</p>
                                                                    </div>
                                                                    <div class="col-sm-8 col-7">
                                                                        <p class="discount-rate">Discount : <span
                                                                                class="discount-percentage">5%</span></p>
                                                                    </div>
                                                                    <div class="col-sm-4 col-5">
                                                                        <p class="">$10</p>
                                                                    </div>
                                                                    <div class="col-sm-8 col-7 grand-total-title">
                                                                        <h4 class="">Grand Total :</h4>
                                                                    </div>
                                                                    <div class="col-sm-4 col-5 grand-total-amount">
                                                                        <h4 class="">$3845</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="inv--note">
                                                    <div class="row mt-4">
                                                        <div class="col-sm-12 col-12 order-sm-0 order-1">
                                                            <p>Note: Thank you for doing Business with us.</p>
                                                        </div>
                                                    </div>
                                                </div> -->
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
                                        <div class="col-xl-12 col-md-3 col-sm-6">
                                            <a href="javascript:;" class="btn btn-primary btn-send">Send Invoice</a>
                                        </div>
                                        <div class="col-xl-12 col-md-3 col-sm-6">
                                            <a href="javascript:;" class="btn btn-success btn-download">Download</a>
                                        </div>
                                        <div class="col-xl-12 col-md-3 col-sm-6">
                                            <router-link to="/apps/invoice/edit"
                                                class="btn btn-dark btn-edit">Edit</router-link>
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
</template>

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
        // { key: 'action', label: '', },
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
                                                        <div v-if="store.state.orders.order.customer" class="col-sm-8 align-self-center pt-5">
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
                                                                    {{ store.state.orders.order.delivery_tracking_number }}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div class="col-sm-4 align-self-start pt-5 text-sm-end">
                                                            <p>
                                                                <span class="inv-subtitle">Статус заказа: </span>
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
                                                                <span class="inv-subtitle">Менеджер: </span>
                                                                <span>
                                                                    {{ store.state.orders.order.manager_user.full_name
                                                                    }}
                                                                </span>
                                                            </p>
                                                            <p v-if="store.state.orders.order.assembler">
                                                                <span class="inv-subtitle">Сборщик: </span>
                                                                <span>
                                                                    {{ store.state.orders.order.assembler_user.full_name
                                                                    }}
                                                                </span>
                                                            </p>
                                                            <p v-if="store.state.orders.order.assembling_start">
                                                                <span class="inv-subtitle">Сборка начата: </span>
                                                                <span>
                                                                    {{ store.state.orders.order.assembling_start.toLocaleDateString('ru-RU')
                                                                    }}
                                                                </span>
                                                            </p>
                                                            <p v-if="store.state.orders.order.assembling_end">
                                                                <span class="inv-subtitle">Сборка завершена: </span>
                                                                <span>
                                                                    {{ store.state.orders.order.assembling_end.toLocaleDateString('ru-RU')
                                                                    }}
                                                                </span>
                                                            </p>
                                                            <p v-if="store.state.orders.order.picked_at">
                                                                <span class="inv-subtitle">Отправлен: </span>
                                                                <span>
                                                                    {{ store.state.orders.order.picked_at.toLocaleDateString('ru-RU') }}
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
                                                                        {{ store.state.orders.order.comment_for_manager }}
                                                                    </td>
                                                                    <td>
                                                                        {{ store.state.orders.order.comment_for_assembler }}
                                                                    </td>
                                                                    <td>
                                                                        {{ store.state.orders.order.comment_for_picker }}
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
                                        <!-- <div class="col-xl-12 col-md-3 col-sm-6">
                                            <a href="javascript:;" class="btn btn-primary btn-send">Send Invoice</a>
                                        </div>
                                        <div class="col-xl-12 col-md-3 col-sm-6">
                                            <a href="javascript:;" class="btn btn-success btn-download">Download</a>
                                        </div>
                                        <div class="col-xl-12 col-md-3 col-sm-6">
                                            <router-link to="/apps/invoice/edit"
                                                class="btn btn-dark btn-edit">Edit</router-link>
                                        </div> -->
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

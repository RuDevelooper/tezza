<script setup>
import { onMounted, ref } from 'vue';
import '@/assets/sass/apps/invoice-preview.scss';

import { useMeta } from '@/composables/use-meta';

import { useStore } from 'vuex';
const store = useStore();

import { useRoute } from 'vue-router';
useMeta({ title: 'Заказ на упаковку' });

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
        { key: 'price', label: 'Цена', },
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
        () => store.dispatch('orders/fetchById', { id: route.query.id })
    )
}
const add_favorites = () => {
    store.dispatch('orders/update_assembler', {
        "id": store.state.orders.order.id,
        "assembler": store.state.auth.user.id,
        "assembling_start": new Date(),
        "status": "assembly",
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
                title: `Заказ добавлен к вашим`,
                padding: '2em'
            });
        }
    ).then(() => store.dispatch('orders/fetchFilter', assembler_filter))
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
                                <li class="breadcrumb-item"><a href="javascript:;">Заказы на упаковку</a></li>
                                <li class="breadcrumb-item">
                                    <router-link to="/picker/orders" class="breadcrumb-item">
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

                                                        <div v-if="store.state.orders.order.customer" class="col-sm-6 align-self-center pt-5">
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
                                                        <!-- <div class="col-sm-6 align-self-center mt-3 text-sm-end">
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
                                                        </div> -->
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
                                                                        {{ item.product.size }} см
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
                                                                        {{ item.product.price.toLocaleString('ru-RU') }} руб.
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
                                        <div v-if="store.state.orders.order.assembler_user == null && store.state.orders.order.status == 'Новый'"
                                            class="col-xl-12 col-md-3 col-sm-6" @click="add_favorites()">
                                            <a href="javascript:;" class="btn btn-success btn-send">Добавить к моим</a>
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

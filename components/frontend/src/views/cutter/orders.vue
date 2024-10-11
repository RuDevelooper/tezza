<script setup>
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import '@/assets/sass/apps/invoice-list.scss';

import { useMeta } from '@/composables/use-meta';

useMeta({ title: 'Заказы на упаковку' });

const store = useStore();
const items = ref([]);
const columns = ref([
    'row_id',
    'order_num',
    'sku',
    'title',
    'material',
    'color',
    'size',
    'side',
]);
const headings = {
    row_id: '',
    order_num: 'Заказ',
    sku: 'Артикул',
    title: 'Наименование',
    material: 'Материал',
    color: 'Цвет',
    size: 'Размер',
    side: 'Сторона',
}

const table_option = ref({
    headings: headings,
    perPage: 10,
    perPageValues: [10, 20, 50, 100],
    skin: 'table table-hover',
    columnsClasses: { actions: 'actions text-center' },
    pagination: { nav: 'scroll', chunk: 20 },
    resizableColumns: false,
    sortable: [
        'sku',
        'title',
        'material',
        'color',
        'size',
        'side',
    ],
    sortIcon: {
        base: 'sort-icon-none',
        up: 'sort-icon-asc',
        down: 'sort-icon-desc',
    },
    texts: {
        count: 'С {from} по {to} из {count}',
        filter: '',
        filterPlaceholder: 'Поиск...',
        limit: 'Показать:',
        noResults: "Нет данных",
        filterBy: "Фильтр",
    },
});
const selected_rows = ref([]);

onMounted(() => {
    bind_data();
});
const order_items_filter = `status=new&ordering=-added_at`
const bind_data = () => {
    store.dispatch('order_items/fetchFilter', order_items_filter)
};

const mark_as_cut = (item) => {
    store.dispatch('orders/setOrderItemDone', {
        "id": item,
        "status": "cut",
    }).then(
        () => store.dispatch('order_items/fetchFilter', order_items_filter)
    );
};

const delete_row = (item) => {
    if (confirm(`Уверены что хотите отправить ${selected_rows.value.length} изделий?`)) {
        selected_rows.value.map(mark_as_cut);
        store.dispatch('order_items/fetchFilter', order_items_filter)
    }
};
const selcted_row = (id, value) => {
    if (value) {
        selected_rows.value.push(id)
    } else {
        let index = selected_rows.value.indexOf(id);
        if (index > -1) selected_rows.value.splice(index, 1);
    }
    return;
};
const chk = ref({});
</script>

<template>
    <div class="layout-px-spacing apps-invoice-list">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="javascript:;">Новые изделия</a></li>
                                <li class="breadcrumb-item active" aria-current="page"><span>Список</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <div class="row layout-top-spacing">
            <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                <div class="panel br-6">
                    <div class="custom-table">
                        <v-client-table :data="store.state.order_items.order_items" :columns="columns"
                            :options="table_option">
                            <template #beforeFilter>
                                <button :disabled="selected_rows.length == 0" type="button" class="btn ml-2 btn-primary" @click="delete_row()">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-check me-2" data-v-5522efca="">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Отправлены на резку
                                </button>
                            </template>
                            <template #row_id="props">
                                <div class="checkbox-outline-primary custom-control custom-checkbox">
                                    <input variant="primary" type="checkbox" class="custom-control-input"
                                        :id="'chk' + props.row.id" v-model="chk[props.row.id]"
                                        @change="selcted_row(props.row.id, chk[props.row.id])" />
                                    <label class="custom-control-label" :for="'chk' + props.row.id"></label>
                                </div>
                            </template>
                            <template #order_num="props">
                                <router-link :to="{ path: '/cutter/order', query: { id: props.row.order } }">
                                    <span class="inv-number">{{ props.row.order_num }}</span>
                                </router-link>
                            </template>
                            <template #sku="props">
                                <div :data_sort="props.row.product.sku">
                                    {{ props.row.product.sku }}
                                </div>
                            </template>
                            <template #title="props">
                                <div :data_sort="props.row.product.title">
                                    {{ props.row.product.title }}
                                </div>
                            </template>
                            <template #material="props">
                                <div :data_sort="props.row.product.material">
                                    {{ props.row.product.material.title }}
                                </div>
                            </template>
                            <template #color="props">
                                <div :data_sort="props.row.product.color">
                                    {{ props.row.product.color.title }}
                                </div>
                            </template>
                            <template #size="props">
                                <div :data_sort="props.row.product.size">
                                    {{ props.row.product.size }}
                                </div>
                            </template>
                            <template #side="props">
                                <div :data_sort="props.row.product.side">
                                    {{ props.row.product.side }} - {{ props.row.product.side_point }}
                                </div>
                            </template>
                        </v-client-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

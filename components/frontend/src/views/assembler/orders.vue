<script setup>
import { useStore } from "vuex";
import { onMounted, ref, nextTick, onUn } from "vue";
import "@/assets/sass/apps/invoice-list.scss";

import { useMeta } from "@/composables/use-meta";

import { EventBus } from "v-tables-3";

useMeta({ title: "Заказы на сборку" });

const store = useStore();

const items = ref([]);
const columns = ref([
  "fav",
  "number",
  "deadline",
  // 'customer',
  "items_assembled",
//   "comment_for_assembler",
  "assembler",
  "status",
  "actions",
]);
const headings = {
  number: "Номер заказа",
  created_at: "Дата",
  customer: "Заказчик",
  deadline: "Закончить до",
  items: "Изделий в заказе",
  items_assembled: "Собрано",
  items_assembled_percent: "%",
  comment_for_assembler: "Комментарий",
  assembler: "Сборщик",
  status: "Статус",
  fav: "Мои",
  actions: "",
};

const table_option = ref({
  headings: headings,
  perPage: 10,
  perPageValues: [10, 20, 50, 100],
  skin: "table table-hover",
  columnsClasses: { actions: "actions text-center" },
  pagination: { nav: "scroll", chunk: 20 },
  resizableColumns: false,
  sortable: [
    "invoice",
    "created_at",
    "customer",
    "deadline",
    "items",
    "items_assembled",
    "items_assembled_percent",
    "comment_for_assembler",
    "assembler",
    "status",
    "fav",
  ],
  sortIcon: {
    base: "sort-icon-none",
    up: "sort-icon-asc",
    down: "sort-icon-desc",
  },
  texts: {
    count: "С {from} по {to} из {count}",
    filter: "",
    filterPlaceholder: "Поиск...",
    limit: "Показать:",
    noResults: "Нет данных",
    filterBy: "Фильтр",
  },
  customFilters: [
    {
      name: "myOrders",
      callback: (row, user_id) => row.assembler == user_id,
    },
    {
      name: "all",
      callback: (row, query) => true,
    },
  ],
});
const selected_rows = ref([]);
const statuses = ref({
  Новый: "warning",
  "Ожидает оплаты": "warning",
  Оплачен: "success",
  Сборка: "info",
  Собран: "dark",
  Покраска: "success",
  Упаковка: "success",
  Отправлен: "success",
  Завершен: "success",
});

onMounted(() => {
  bind_data();
});
const assembler_filter =
  "status__in=new,wait_payment,payed,assembly&ordering=due_date";
const bind_data = async () => {
  while (true) {
    store.dispatch("orders/fetchFilter", assembler_filter);
    break;
    await new Promise(r => setTimeout(r, 300.0 * 1000));
  }
};

const delete_row = (item) => {
  if (confirm("Are you sure want to delete selected row ?")) {
    if (item) {
      items.value = items.value.filter((d) => d.id != item.id);
    } else {
      items.value = items.value.filter(
        (d) => !selected_rows.value.includes(d.id)
      );
    }
  }
};

const add_favorites = (item) => {
  store
    .dispatch("orders/update_assembler", {
      id: item.id,
      assembler: store.state.auth.user.id,
      assembling_start: new Date(),
      status: "assembly",
    })
    .then(() => store.dispatch("orders/fetchFilter", assembler_filter));
};

const checkDate = (inputDate) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (inputDate.toDateString() === today.toDateString()) {
    return "warning";
  } else if (inputDate.toDateString() === tomorrow.toDateString()) {
    return "success";
  } else if (inputDate < today) {
    return "danger";
  }
};

const showTable = ref(true);
let clickedMyOrdersOnly = ref(false);
const myOrdersOnlyFilter = () => {
  clickedMyOrdersOnly.value = !clickedMyOrdersOnly.value;

  if (clickedMyOrdersOnly.value) {
    EventBus.emit("vue-tables.filter::myOrders", store.state.auth.user.id);
  } else {
    showTable.value = !showTable.value;

    nextTick(() => (showTable.value = !showTable.value));
  }
};
</script>

<template>
  <div class="layout-px-spacing apps-invoice-list">
    <teleport to="#breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="javascript:;">Заказы на сборку</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  <span>Список</span>
                </li>
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
            <v-client-table
              v-if="showTable"
              :data="store.state.orders.orders"
              :columns="columns"
              :options="table_option"
            >
              <template #afterFilterWrapper>
                <button
                  type="button"
                  class="btn me-4"
                  @click="myOrdersOnlyFilter()"
                  :class="
                    clickedMyOrdersOnly
                      ? 'btn-secondary'
                      : 'btn-outline-secondary'
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-star me-2"
                    :class="
                      clickedMyOrdersOnly
                        ? ''
                        : 'text-warning'
                    "
                    data-v-02c2cbc4=""
                  >
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    ></polygon>
                  </svg>
                  Мои заказы
                  <span
                    class="badge badge-danger counter"
                    style="top: -8px; right: -8px"
                  >
                    {{
                      store.state.orders.orders.reduce(
                        (acc, e) =>
                          acc +
                          (e.assembler == store.state.auth.user.id ? 1 : 0),
                        0
                      )
                    }}</span
                  >
                </button>
              </template>
              <template #fav="props">
                <div :data_sort="props.row.assembler" class="text-center">
                  <div v-if="props.row.assembler == store.state.auth.user.id">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-star text-warning"
                      data-v-02c2cbc4=""
                    >
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                      ></polygon>
                    </svg>
                  </div>
                </div>
              </template>
              <template #number="props">
                <router-link
                  :to="{
                    path: '/assembler/order',
                    query: { id: props.row.id },
                  }"
                >
                  <span class="inv-number">{{ props.row.number }}</span>
                </router-link>
              </template>
              <template #created_at="props">
                <div :data_sort="props.row.created_at">
                  {{ props.row.created_at.toLocaleDateString("ru") }}
                </div>
              </template>
              <template #assembler="props">
                <div>
                  {{
                    props.row.assembler
                      ? props.row.assembler_user.full_name
                      : ""
                  }}
                </div>
              </template>
              <template #customer="props">
                <div>{{ props.row.customer.name || "" }}</div>
              </template>
              <template #deadline="props">
                <div
                  :data_sort="props.row.assembler_deadline"
                  :class="`text-${checkDate(props.row.assembler_deadline)}`"
                >
                  {{ props.row.assembler_deadline_locale_date }}
                </div>
              </template>
              <template #status="props">
                <span
                  class="badge inv-status"
                  :class="'badge-' + statuses[props.row.status]"
                >
                  {{ props.row.status }}
                </span>
              </template>

              <template #items="props">
                <div :data_sort="props.row.deadline">
                  {{ props.row.items.length }}
                </div>
              </template>
              <template #items_assembled="props">
                <div :data_sort="props.row.items.length">
                  {{
                    props.row.items.filter((x) => x.status_name == "Собран")
                      .length
                  }}
                  из {{ props.row.items.length }}
                </div>
              </template>
              <template #actions="props">
                <div class="mb-4 me-2 custom-dropdown dropdown btn-group">
                  <a
                    class="btn dropdown-toggle btn-icon-only"
                    href="#"
                    role="button"
                    id="pendingTask"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style="width: 24px; height: 24px"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-more-horizontal"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </a>

                  <ul
                    class="dropdown-menu dropdown-menu-end"
                    aria-labelledby="pendingTask"
                  >
                    <!-- <li>
                                            <router-link href="javascript:void(0);" to="/orders/edit"
                                                class="dropdown-item action-edit"><svg xmlns="http://www.w3.org/2000/svg"
                                                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round" class="feather feather-edit-3">
                                                    <path d="M12 20h9"></path>
                                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z">
                                                    </path>
                                                </svg>
                                                Edit
                                            </router-link>
                                        </li> -->
                    <li>
                      <a
                        href="javascript:void(0);"
                        @click="add_favorites(props.row)"
                        class="dropdown-item action-favorites"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="feather feather-star"
                          data-v-5522efca=""
                        >
                          <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                          ></polygon>
                        </svg>
                        Добавить к моим
                      </a>
                    </li>
                  </ul>
                </div>
              </template>
            </v-client-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
